import { configDotenv } from 'dotenv'
configDotenv({ path: "./.env" })

const CONCURRENCY_LIMIT = 4;
const appConfig = {
    PORT: 3000,
    db: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 5432,
        user: process.env.USER || 'postgres',
        password: process.env.PASSWORD,
        database: process.env.DATABASE || 'postgres',
    },
    pool_db: {
        host:  process.env.HOST || 'localhost',
        port: process.env.PORT || 5432,
        user:  process.env.USER || 'postgres',
        password:  process.env.PASSWORD,
        database: process.env.DATABASE || 'postgres',
        max: CONCURRENCY_LIMIT,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    },
    router: {
        SAMPLE_PREFIX: '/api/sample',
    },
}

export { appConfig }