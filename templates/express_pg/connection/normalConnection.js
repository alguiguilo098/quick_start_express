import pg from 'pg'
import { appendFileSync } from 'fs'

import { appConfig } from '../config/appConfig.js'

const { Client } = pg

const getClient = () => {
    let client = null
    try {
        client = new Client(appConfig.db)
        return client
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`
        console.error(errMessage);
        appendFileSync('./logs/connection/normalConnection.log', `${errMessage}\n`);
    }
}

export { getClient }