import { readFile, appendFileSync } from 'fs';
import { appConfig } from '../config/appConfig.js';

const reInitDb = (client) => {
    try {
        readFile('./db/reInitDb.sql', 'utf8', async (err, data) => {
            if (err) {
                const timeStamp = new Date().toLocaleString();
                const errMessage = `[ERROR]: ${timeStamp} - reInitDb - ${err.message}`
                console.error(errMessage);
            } else {
                try {
                    await client.connect()
                    await client.query(data)
                    console.info('[INFO]: Database re-initialized.');
                } catch (err) {
                    const timeStamp = new Date().toLocaleString();
                    const errMessage = `[ERROR]: ${timeStamp} - reInitDb - ${err.message}`
                    console.error(errMessage);
                    console.warn(`[HINT]: Database '${appConfig.db.database}' does not exist. Please create it by running the following command in your MySQL shell: 'CREATE DATABASE ${appConfig.db.database}'.`);
                } finally {
                    await client.end()
                }
            }
        });
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`
        console.error(errMessage);
        appendFileSync('./logs/db/reInitDb.log', `${errMessage}\n`);
    }
}

export { reInitDb };