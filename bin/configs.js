export const metadata = {
  command: "qse",
  name: "Quick Start Express",
  version: "v1.0.6-beta",
  description:
    "A simple CLI tool to generate Express servers from multiple available templates.",
  oneLineDescription: "A simple Express.js server generator CLI tool.",
};

export const commands = {
  version: {
    command: "-v, --version",
    description: "Prints current qse version",
  },
  init: {
    command: "init",
    description: "Initialize a new Express server.",
    options: [
      {
        flags: "-t, --template <template>",
        description: "Specify template to use",
      },
      {
        flags: "-n, --name <name>",
        description: "Specify the name of the package",
      },
      {
        flags: "--remove-nodemon",
        description: "Disable hot-reload support using nodemon",
      },
      {
        flags: "--remove-deps",
        description: "Do not install the dependencies",
      },
    ],
  },
  list: {
    command: "list",
    description: "List all available commands and options.",
  },
  clear: {
    command: "clear",
    description: "Clear the directory.",
  },
};

export const templates = {
  basic: {
    name: "basic",
  },
  express_pg_sequelize: {
    name: "express_pg_sequelize",
  },
  express_mysql: {
    name: "express_mysql",
  },
  express_pg_prisma: {
    name: "express_pg_prisma",
  },
  express_oauth_microsoft: {
    name: "express_oauth_microsoft",
  },
  express_oauth_google: {
    name: "express_oauth_google",
  },
  express_ts_basic: {
    name: "express_ts_basic",
    description: 'Express with TypeScript template',
    path: './templates/express_ts_basic',
    dependencies: [
      {
        name: "express",
        version: "^4.17.1",
      },
      {
        name: "typescript",
        version: "^5.0.0", 
      },
      {
        name: "@types/node",
        version: "^20.0.0", 
      },
      {
        name: "@types/express",
        version: "^4.17.17", 
      },
      {
        name: "ts-node-dev",
        version: "^2.0.0", 
      },
    ],
  },
};
