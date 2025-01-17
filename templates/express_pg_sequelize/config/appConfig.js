export const appConfig = {
    PORT: process.env.SERVER_PORT || 8080,
    dbConfig: {
        database: process.env.DB_NAME,
        username: process.env.POSTGRES_USER || "root",
        password: process.env.POSTGRES_PASSWORD || "password",
        options: {
            host: process.env.DB_HOST || "localhost",
            dialect: process.env.DB || "mysql",
            multipleStatements: true,
        },
    }
};
