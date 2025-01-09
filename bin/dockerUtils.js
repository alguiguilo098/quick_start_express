// Inquirer used to Create Prompts in Terminal.
import inquirer from "inquirer";

export async function promptUserForServices() {
  const services = [];

  // Aggregating the answers for app service
  const appAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "serviceName",
      message: "Enter the name of the app service (default: app):",
      default: "app",
    },
    {
      type: "input",
      name: "image",
      message: "Enter the Docker image for the app service (default: node:20-alpine):",
      default: "node:20-alpine",
    },
    {
      type: "input",
      name: "containerName",
      message: "Enter the container name for the app service (default: app_container):",
      default: "app_container",
    },
    {
      type: "input",
      name: "ports",
      message: "Enter the ports to expose for the app service (default: 8080:8080):",
      default: "8080:8080",
      validate: (input) => {
        const validFormat = /^\d+:\d+$/;
        return validFormat.test(input) || "Ports must be in the format hostPort:containerPort.";
      },
    },
    {
      type: "confirm",
      name: "addEnvironmentVariables",
      message: "Do you want to add environment variables for the app service?",
      default: false,
    },
    {
      type: "input",
      name: "environmentVariables",
      message: "Enter environment variables (comma-separated, e.g., VAR1=value1,VAR2=value2):",
      when: (answers) => answers.addEnvironmentVariables,
      validate: (input) => {
        return input.split(",").every((env) => env.includes("=")) || "Each variable must be in VAR=value format.";
      },
    },
  ]);

  services.push({
    name: appAnswers.serviceName,
    image: appAnswers.image,
    containerName: appAnswers.containerName,
    ports: [appAnswers.ports],
    environment: appAnswers.addEnvironmentVariables
      ? appAnswers.environmentVariables.split(",").reduce((envObj, env) => {
          const [key, value] = env.split("=");
          envObj[key] = value;
          return envObj;
        }, {})
      : undefined,
  });

  // Aggregating the answers for DB service.
  const addDbService = await inquirer.prompt({
    type: "confirm",
    name: "addDbService",
    message: "Do you want to add a database service?",
    default: false,
  });

  if (addDbService.addDbService) {
    const dbAnswers = await inquirer.prompt([
      {
        type: "input",
        name: "serviceName",
        message: "Enter the name of the database service (default: db):",
        default: "db",
      },
      {
        type: "input",
        name: "image",
        message: "Enter the Docker image for the database (default: mysql:latest):",
        default: "mysql:latest",
      },
      {
        type: "input",
        name: "containerName",
        message: "Enter the container name for the database service (default: db_container):",
        default: "db_container",
      },
      {
        type: "input",
        name: "ports",
        message: "Enter the ports to expose for the database service (default: 5432:5432):",
        default: "5432:5432",
        validate: (input) => {
          const validFormat = /^\d+:\d+$/;
          return validFormat.test(input) || "Ports must be in the format hostPort:containerPort.";
        },
      },
      {
        type: "confirm",
        name: "addEnvironmentVariables",
        message: "Do you want to add environment variables for the database service?",
        default: false,
      },
      {
        type: "input",
        name: "environmentVariables",
        message: "Enter environment variables (comma-separated, e.g., VAR1=value1,VAR2=value2):",
        when: (answers) => answers.addEnvironmentVariables,
        validate: (input) => {
          return input.split(",").every((env) => env.includes("=")) || "Each variable must be in VAR=value format.";
        },
      },
    ]);

    services.push({
      name: dbAnswers.serviceName,
      image: dbAnswers.image,
      containerName: dbAnswers.containerName,
      ports: [dbAnswers.ports],
      environment: dbAnswers.addEnvironmentVariables
        ? dbAnswers.environmentVariables.split(",").reduce((envObj, env) => {
            const [key, value] = env.split("=");
            envObj[key] = value;
            return envObj;
          }, {})
        : undefined,
    });
  }

  // Aggregating the answers for Cache Service.
  const addCacheService = await inquirer.prompt({
    type: "confirm",
    name: "addCacheService",
    message: "Do you want to add a cache service?",
    default: false,
  });

  if (addCacheService.addCacheService) {
    const cacheAnswers = await inquirer.prompt([
      {
        type: "input",
        name: "serviceName",
        message: "Enter the name of the cache service (default: cache):",
        default: "cache",
      },
      {
        type: "input",
        name: "image",
        message: "Enter the Docker image for the cache service (default: redis:latest):",
        default: "redis:latest",
      },
      {
        type: "input",
        name: "containerName",
        message: "Enter the container name for the cache service (default: cache_container):",
        default: "cache_container",
      },
      {
        type: "input",
        name: "ports",
        message: "Enter the ports to expose for the cache service (default: 6379:6379):",
        default: "6379:6379",
        validate: (input) => {
          const validFormat = /^\d+:\d+$/;
          return validFormat.test(input) || "Ports must be in the format hostPort:containerPort.";
        },
      },
      {
        type: "confirm",
        name: "addEnvironmentVariables",
        message: "Do you want to add environment variables for the cache service?",
        default: false,
      },
      {
        type: "input",
        name: "environmentVariables",
        message: "Enter environment variables (comma-separated, e.g., VAR1=value1,VAR2=value2):",
        when: (answers) => answers.addEnvironmentVariables,
        validate: (input) => {
          return input.split(",").every((env) => env.includes("=")) || "Each variable must be in VAR=value format.";
        },
      },
    ]);

    services.push({
      name: cacheAnswers.serviceName,
      image: cacheAnswers.image,
      containerName: cacheAnswers.containerName,
      ports: [cacheAnswers.ports],
      environment: cacheAnswers.addEnvironmentVariables
        ? cacheAnswers.environmentVariables.split(",").reduce((envObj, env) => {
            const [key, value] = env.split("=");
            envObj[key] = value;
            return envObj;
          }, {})
        : undefined,
    });
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