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
// Precomputed hashes
const BASIC_TEMPLATE_HASH = '0b54214731f56e8f661a943b8612b2adadc1a7739cd6d055fd3f88bba5657c16';
const EXPRESS_PG_SEQUELIZE_TEMPLATE_HASH = '13bd37f300eb11bc7c63012b3c9635d6adcaecff46ded44997f947fd4adf3afb';
const EXPRESS_MYSQL_TEMPLATE_HASH = '689d3c2957c6efcb17a0dffcc61447bbd92c27d3f9f3b0233c744f9659893534';

describe('init', () => {
    beforeEach(() => {
        initTempDirectory();
    });    

    afterAll(() => {
        clearTempDirectory();
    });

    test('no templates passed, should default to basic', async () => {
        
        console.time('Hash Calculation');
        const originalHash = computeSHA256Hash(path.join(__dirname, '..', 'templates', 'basic'));
        console.timeEnd('Hash Calculation');
        console.time('Command Execution');
        await exec(`node ../../bin/index.js init`, { cwd: tempDir });
        console.timeEnd('Command Execution');
        console.time('Hash Verification');
        const commandHash = computeSHA256Hash(tempDir);
        console.timeEnd('Hash Verification');
        expect(commandHash).toEqual(originalHash);
    })

    test('basic', async () => {
        await exec(`node ../../bin/index.js init -t basic`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(BASIC_TEMPLATE_HASH);
    });

    test('express_pg_sequelize', async () => {
        await exec(`node ../../bin/index.js init -t express_pg_sequelize`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(EXPRESS_PG_SEQUELIZE_TEMPLATE_HASH);
    }, 10000);

    test('express_mysql', async () => {
        await exec(`node ../../bin/index.js init -t express_mysql`, { cwd: tempDir });
        const commandHash = computeSHA256Hash(tempDir);
        expect(commandHash).toEqual(EXPRESS_MYSQL_TEMPLATE_HASH);
    }, 10000);

    test('invalid template name passed', async () => {
        const { stdout, stderr } = await exec(`node ../../bin/index.js init -t invalid_name`, { cwd: tempDir });
        expect(stderr).toContain(`Template invalid_name does not exist. To see available templates use "qse list".`);
    });
});
