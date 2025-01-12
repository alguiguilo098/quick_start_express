import { configDotenv } from 'dotenv'
configDotenv({ path: "./.env" })

const CONCURRENCY_LIMIT = 4;
export const appConfig = {
    PORT: 5000,
    db: {
        host: process.env.HOST || 'localhost',
        user: process.env.USER || 'root',
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        multipleStatements: true
    },
    pool_db: {
        host: process.env.HOST || 'localhost',
        user: process.env.USER || 'root',
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        waitForConnections: true,
        connectionLimit: CONCURRENCY_LIMIT,
        queueLimit: 0,
    },
    router: {
        SAMPLE_PREFIX: '/api/sample',
    },
}