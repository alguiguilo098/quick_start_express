const CONCURRENCY_LIMIT = 4;
export const appConfig = {
    PORT: 5000,
    db: {
        host: "localhost",
        user: "root",
        password: "password",
        database: "database_name",
        multipleStatements: true,
    },
    pool_db: {
        host: "localhost",
        user: "root",
        password: "password",
        database: "database_name",
        waitForConnections: true,
        connectionLimit: CONCURRENCY_LIMIT,
        queueLimit: 0,
    },
    router: {
        SAMPLE_PREFIX: "/api/sample",
    },
};
