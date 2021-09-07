#!/usr/bin/env node
'use strict';

import * as Path from 'path';
import { writeFileSync, copyFileSync } from 'fs';
import readline from 'readline';
import { spawn } from 'child_process';

async function installDependencies() {
  const dependencies = {
    '@types/jest': '^27.0.1',
    '@types/node': '^14.14.31',
    jest: '^27.1.0',
    'ts-jest': '^27.0.5',
    'ts-jest-resolver': '^1.1.0',
    'ts-node': '^9.1.1',
    typescript: '^4.1.3',
    prettier: '^2.3.2',
  };

  const args = Object.entries(dependencies).map(([name, version]) => `${name}@${version}`);

  return new Promise((resolve, reject) => {
    const npm = spawn('npm', ['install', '-D', ...args], {
      stdio: 'inherit',
    });

    npm.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

function copyFiles() {
  const files = ['jest.config.ts', 'tsconfig.json', '.prettierrc'];
  const __dirname = decodeURIComponent(new URL('.', import.meta.url).pathname);

  files.forEach((file) => {
    const source = Path.join(__dirname, file);
    const destination = Path.join(process.cwd(), file);

    copyFileSync(source, destination);
  });
}

function updatePrompt() {
  confirm('Should I also update your package.json with new test scripts?', (answer) => {
    if (answer) {
      const packageJsonPath = Path.join(process.cwd(), 'package.json');
      const packageJson = require(packageJsonPath);

      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.test = 'jest';
      packageJson.scripts.tdd = 'jest --watch';

      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('package.json updated');
    }
  });
}

async function main() {
  const ok = await confirm('Ready to install dependencies and update your project. Continue?');

  if (!ok) {
    return;
  }

  await installDependencies();
  copyFiles();
  updatePrompt();
}

main();

function confirm(question) {
  return new Promise((resolve, reject) => {
    const cli = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    cli.question(`${question} (y,n)`, (answer) => {
      cli.close();
      resolve(answer === '' || answer.toLowerCase() === 'y');
    });
  });
}
