const CONCURRENCY_LIMIT = 4;
const appConfig = {
    PORT: 3000,
    db: {
        user: 'postgres',
        password: 'password',
        host: 'localhost',
        port: 5432,
        database: 'database_name',
    },
    pool_db: {
        host: 'localhost',
        user: 'database_name',
        password: 'password',
        max: CONCURRENCY_LIMIT,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    },
    router: {
        SAMPLE_PREFIX: '/api/sample',
    },
}

export { appConfig }