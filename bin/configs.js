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
                flags: "--docker-compose",
                description: "Generate a Docker Compose file in the project.",
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
        isUrl: false,
        serverPort: "8080:8080",
    },
    basic_ts: {
        name: "basic_ts",
        isUrl: false,
        serverPort: "8080:8080",
    },
    express_pg: {
        name: "express_pg",
        isUrl: false,
        dbPort: "5432:5432",
        dbName: "Postgres",
        serverPort: "8080:8080",
        dbDockerImage: "postgres:latest",
    },
    express_pg_sequelize: {
        name: "express_pg_sequelize",
        isUrl: false,
        dbPort: "5432:5432",
        dbName: "Postgres",
        serverPort: "8080:8080",
        dbDockerImage: "postgres:latest",
    },
    express_mysql: {
        name: "express_mysql",
        isUrl: false,
        dbPort: "3306:3306",
        dbName: "MySQL",
        serverPort: "8080:8080",
        dbDockerImage: "mysql:latest",
    },
    express_pg_prisma: {
        name: "express_pg_prisma",
        isUrl: true,
        dbPort: "5432:5432",
        dbName: "Postgres",
        serverPort: "8080:8080",
        dbDockerImage: "postgres:latest",
    },
    express_oauth_microsoft: {
        isUrl: false,
        name: "express_oauth_microsoft",
        serverPort: "8080:8080",
    },
    express_oauth_google: {
        isUrl: false,
        name: "express_oauth_google",
        serverPort: "8080:8080",
    },
};
