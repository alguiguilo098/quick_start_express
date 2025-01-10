import inquirer from "inquirer";

function validatePortFormat(input) {
  const validFormat = /^\d+:\d+$/;
  return validFormat.test(input) || "Ports must be in the format hostPort:containerPort.";
}

function validateEnvironmentVariables(input) {
  return input.split(",").every((env) => env.includes("=")) || "Each variable must be in VAR=value format.";
}

/*
TODO:
Looking forward to change the format of env variables like below:

docker-compose.yml
version: '3.8'
services:
  app:
      image: node:20-alpine
      container_name: app_container
      ports:
        - "8080:8080"
      environment:
        - MYSQL_USER=${DB_USER}
        - MYSQL_PASSWORD=${DB_PASSWORD}
      restart: on-failure

*/
async function promptForEnvironmentVariables() {
  const { addEnvironmentVariables } = await inquirer.prompt({
    type: "confirm",
    name: "addEnvironmentVariables",
    message: "Do you want to add environment variables?",
    default: false,
  });

  if (addEnvironmentVariables) {
    const { environmentVariables } = await inquirer.prompt({
      type: "input",
      name: "environmentVariables",
      message: "Enter environment variables (comma-separated, e.g., VAR1=value1,VAR2=value2):",
      validate: validateEnvironmentVariables,
    });

    return environmentVariables.split(",").reduce((envObj, env) => {
      const [key, value] = env.split("=");
      envObj[key] = value;
      return envObj;
    }, {});
  }
  return undefined;
}

async function promptAppService(packageName) {
  const appAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "image",
      message: "Enter the Docker image for the app service (default: node:20-alpine):",
      default: "node:20-alpine",
    },
    {
      type: "input",
      name: "ports",
      message: "Enter the ports to expose for the app service (default: 8080:8080):",
      default: "8080:8080",
      validate: validatePortFormat,
    },
  ]);

  const environment = await promptForEnvironmentVariables();

  return {
    name: packageName,
    image: appAnswers.image,
    containerName: `${packageName}_container`,
    ports: [appAnswers.ports],
    environment,
  };
}

async function promptDbService(packageName) {
  const dbAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "image",
      message: "Enter the Docker image for the database (default: mysql:latest):",
      default: "mysql:latest",
    },
    {
      type: "input",
      name: "ports",
      message: "Enter the ports to expose for the database service (default: 5432:5432):",
      default: "5432:5432",
      validate: validatePortFormat,
    },
  ]);

  const environment = await promptForEnvironmentVariables();

  return {
    name: `${packageName}_db`,
    image: dbAnswers.image,
    containerName: `${packageName}_db_container`,
    ports: [dbAnswers.ports],
    environment,
  };
}

async function promptCacheService(packageName) {
  const cacheAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "image",
      message: "Enter the Docker image for the cache service (default: redis:latest):",
      default: "redis:latest",
    },
    {
      type: "input",
      name: "ports",
      message: "Enter the ports to expose for the cache service (default: 6379:6379):",
      default: "6379:6379",
      validate: validatePortFormat,
    },
  ]);

  const environment = await promptForEnvironmentVariables();

  return {
    name: `${packageName}_cache`,
    image: cacheAnswers.image,
    containerName: `${packageName}_cache_container`,
    ports: [cacheAnswers.ports],
    environment,
  };
}

export async function promptUserForServices(packageName, selectedTemplate) {
  const services = [];

  services.push(await promptAppService(packageName));

  if (isDBRequired(selectedTemplate)) {
    services.push(await promptDbService(packageName));
  }

  const { addCacheService } = await inquirer.prompt({
    type: "confirm",
    name: "addCacheService",
    message: "Do you want to add a cache service?",
    default: false,
  });

  if (addCacheService) {
    services.push(await promptCacheService(packageName));
  }

  return services;
}

// Generates the File content for docker_compose.yml using the services data.
export function generateDockerComposeFile(services) {
    const compose = {
      version: "3.8",
      services: {},
    };
  
    services.forEach((service) => {
      compose.services[service.name] = {
        image: service.image,
        container_name: service.containerName,
        ports: service.ports.length > 0 ? service.ports : undefined,
        environment: service.environment || undefined,
        restart: "on-failure",
      };
    });
  
    const yaml = `
version: '${compose.version}'
services:
${Object.entries(compose.services)
  .map(([name, config]) => {
    const ports = config.ports
      ? `      ports:\n${config.ports.map((port) => `        - "${port}"`).join("\n")}`
      : "";
    const environment = config.environment
      ? `      environment:\n${Object.entries(config.environment)
          .map(([key, value]) => `        ${key}: ${value}`)
          .join("\n")}`
      : "";
    return `  ${name}:
      image: ${config.image}
      container_name: ${config.container_name}
${ports}
${environment}
      restart: ${config.restart}`;
  })
  .join("\n")}
`;

return yaml.trim();
}  

// Helper function to check if DB is required by checking the template name.
function isDBRequired(selectedTemplate) {
    const parts = selectedTemplate.split("_");
    for (let part of parts) {
        if (part.toLowerCase() === "pg" || part.toLowerCase() === "mysql") {
            return true;
        }
    }
    return false;
}