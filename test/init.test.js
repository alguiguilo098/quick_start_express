import { createHash } from 'node:crypto';
import path from 'node:path';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'url';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCallback);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, 'temp');

function initTempDirectory() {
    if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true });
    }
    mkdirSync(tempDir);
}

function clearTempDirectory() {
    if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true });
    }
}

function traverseDirectory(dirName, hash) {
    const files = readdirSync(dirName);

    for (const file of files) {
        const filePath = path.join(dirName, file);
        const stats = statSync(filePath);
        if (stats.isDirectory()) {
            traverseDirectory(filePath, hash);
        } else {
            const data = readFileSync(filePath);
            hash.update(data);
        }
    }
}

// Ignore node_modules and package-lock.json
// and compute the SHA256 hash.
function computeSHA256Hash(dirName) {
    const hash = createHash('sha256');
    const files = readdirSync(dirName);

    for (const file of files) {
        if (file === 'node_modules' || file === 'package-lock.json' || file === 'package.json') {
            continue;
        }
        const filePath = path.join(dirName, file);
        const stats = statSync(filePath);
        if (stats.isDirectory()) {
            traverseDirectory(filePath, hash);
        } else {
            const data = readFileSync(filePath);
            hash.update(data);
        }
    }

    return hash.digest('hex');
}

describe('init', () => {
    beforeEach(() => {
        initTempDirectory();
    });    

    afterAll(() => {
        clearTempDirectory();
    });

    test('no templates passed, should default to basic', async () => {
        
        const originalHash = computeSHA256Hash(path.join(__dirname, '..', 'templates', 'basic'));
        await exec(`node ../../bin/index.js init`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
    })

    test('basic', async () => {
        const originalHash = computeSHA256Hash(path.join(__dirname, '..', 'templates', 'basic'));
        await exec(`node ../../bin/index.js init -t basic`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
    });

    test('express_pg_sequelize', async () => {
        const originalHash = computeSHA256Hash(path.join(__dirname, '..', 'templates', 'express_pg_sequelize'));
        await exec(`node ../../bin/index.js init -t express_pg_sequelize`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
    }, 10000);

    test('express_mysql', async () => {
        const originalHash = computeSHA256Hash(path.join(__dirname, '..', 'templates', 'express_mysql'));
        await exec(`node ../../bin/index.js init -t express_mysql`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(originalHash);
    }, 10000);

    test('invalid template name passed', async () => {
        const { stdout, stderr } = await exec(`node ../../bin/index.js init -t invalid_name`, { cwd: tempDir });
        expect(stderr).toContain(`Template invalid_name does not exist. To see available templates use "qse list".`);
    });
});
