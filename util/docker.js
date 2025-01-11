import { confirm, input } from "@inquirer/prompts";

function validatePortFormat(input) {
  const validFormat = /^\d+:\d+$/;
  return validFormat.test(input) || "Ports must be in the format hostPort:containerPort.";
}

async function promptForEnvironmentVariables() {
  const addEnvironmentVariables = await confirm({
    message: "Do you want to add environment variables?",
    default: false,
  });

  if (addEnvironmentVariables) {
    const variableInput = await input({
      message: "Enter environment variables separated by commas (e.g., VAR1=DB_USER, VAR2=DB_PASS):",
      validate: (input) => {
        // Regex Expression to Evaluate User Input in Format: VAR1=DB_USER, VAR2=DB_PASS.
        const validFormat = /^([a-zA-Z_][a-zA-Z0-9_]*=[a-zA-Z_][a-zA-Z0-9_]*)(,\s*[a-zA-Z_][a-zA-Z0-9_]*=[a-zA-Z_][a-zA-Z0-9_]*)*$/;
        return (
          validFormat.test(input) ||
          "Input must be in the format VAR1=DB_USER, VAR2=DB_PASS (comma-separated pairs)."
        );
      },
    });

    const environmentVariables = {};
    variableInput.split(",").forEach((pair) => {
      const [key, envVariable] = pair.split("=").map((item) => item.trim());
      environmentVariables[key] = envVariable;
    });

    return environmentVariables;
  }

  return undefined;
}

async function promptAppService(packageName) {
  const image = await input({
    message: "Enter the Docker image for the app service (default: node:20-alpine):",
    default: "node:20-alpine",
  });

  const ports = await input({
    message: "Enter the ports to expose for the app service (default: 8080:8080):",
    default: "8080:8080",
    validate: validatePortFormat,
  });

  const environment = await promptForEnvironmentVariables();

  return {
    name: packageName,
    image,
    containerName: `${packageName}_container`,
    ports: [ports],
    environment,
  };
}

async function promptDbService(packageName) {
  const image = await input({
    message: "Enter the Docker image for the database (default: mysql:latest):",
    default: "mysql:latest",
  });

  const ports = await input({
    message: "Enter the ports to expose for the database service (default: 5432:5432):",
    default: "5432:5432",
    validate: validatePortFormat,
  });

  const environment = await promptForEnvironmentVariables();

  return {
    name: `${packageName}_db`,
    image,
    containerName: `${packageName}_db_container`,
    ports: [ports],
    environment,
  };
}

async function promptCacheService(packageName) {
  const image = await input({
    message: "Enter the Docker image for the cache service (default: redis:latest):",
    default: "redis:latest",
  });

  const ports = await input({
    message: "Enter the ports to expose for the cache service (default: 6379:6379):",
    default: "6379:6379",
    validate: validatePortFormat,
  });

  const environment = await promptForEnvironmentVariables();

  return {
    name: `${packageName}_cache`,
    image,
    containerName: `${packageName}_cache_container`,
    ports: [ports],
    environment,
  };
}

export async function promptUserForServices(packageName, selectedTemplate) {
  const services = [];

  console.log("\n");
  services.push(await promptAppService(packageName));
  console.log("\n");

  if (isDBRequired(selectedTemplate)) {
    services.push(await promptDbService(packageName));
  }
  console.log("\n");

  const addCacheService = await confirm({
    message: "Do you want to add a cache service?",
    default: false,
  });

  if (addCacheService) {
    console.log("Configuring cache service...");
    services.push(await promptCacheService(packageName));
  }
  console.log("\n");

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
      environment: service.environment
        ? Object.entries(service.environment).map(
            ([key, envVariable]) => `${key}=\${${envVariable}}`
          )
        : undefined,
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
      ? `      environment:\n${config.environment.map((env) => `        - ${env}`).join("\n")}`
      : "";
    return `  ${name}:
      image: ${config.image}
      container_name: ${config.container_name}
${ports}
${environment}
      restart: ${config.restart}`;
  })
  .join("\n\n")}`;

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