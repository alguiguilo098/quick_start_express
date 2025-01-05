import { appendFileSync } from 'fs';

export const errorHandlerFunc = (err, res, filePath, statusCode, message) => {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync(`./logs/${filePath}`, `${errMessage}\n`);

    return res.status(statusCode).send({
        "message": message,
        "error": err.message
    });
}
