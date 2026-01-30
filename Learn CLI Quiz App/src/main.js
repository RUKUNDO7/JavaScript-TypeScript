import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify} from 'util';
import { execa } from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';


const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    try {
        await copy(options.templateDirectory, options.targetDirectory, {
            clobber: false,
        });
    } catch (err) {
        console.error('%s Failed to copy project files', chalk.red.bold('ERROR'));
        console.error(err);
        process.exit(1);
    }
}

async function initGit(options) {
    try {
        const result = await execa('git', ['init'], {
            cwd: options.targetDirectory,
        });
        if (result.failed) {
            return Promise.reject(new Error('Failed to initialize Git'));
        }
    } catch (err) {
        return Promise.reject(new Error('Failed to initialize Git'));
    }
}


export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    }

   const currentFileUrl = fileURLToPath(import.meta.url);
   const currentDir = dirname(currentFileUrl);

   const templateDir = path.resolve(
    currentDir, 
    '../templates',
    options.template.toLowerCase()
   )

   options.templateDirectory = templateDir;

   if (!fs.existsSync(templateDir) || !fs.statSync(templateDir).isDirectory()) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    options.templateDirectory = templateDir;
    console.log('Template directory:', templateDir);

    const tasks = new Listr([
        {
            title: 'Copy project files',
            task: () => copyTemplateFiles(options),
            },
            {
                title: 'Initialize git',
                task: () => initGit(options),
                enabled: () => options.git,
            },
            {
                title: 'Install dependencies',
                task: () => projectInstall({
                    cwd: options.targetDirectory,
                }),
                skip: () => !options.runInstall ? 'Pass --install to automatically install dependencies' : undefined,
            }
    ])

    await tasks.run();
     
   console.log('%s Project ready', chalk.green.bold('DONE'));
   return true;
}