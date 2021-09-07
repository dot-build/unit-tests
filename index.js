const Path = require('path');
const { writeFileSync, copyFileSync } = require('fs');
const readline = require('readline');
const { spawn } = require('child_process');

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
  const files = ['jest.config.js', 'tsconfig.json', '.prettierrc'];

  files.forEach((file) => {
    const source = Path.join(__dirname, file);
    const destination = Path.join(process.cwd(), file);
    copyFileSync(source, destination);
  });
}

function updatePrompt() {
  const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  cli.question('Should I update your package.json with test scripts (Y,n) ? ', (name) => {
    if (name === '' || name.toLowerCase() === 'y') {
      const packageJsonPath = Path.join(process.cwd(), 'package.json');
      const packageJson = require(packageJsonPath);

      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.test = 'jest';
      packageJson.scripts.tdd = 'jest --watch';

      FS.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('package.json updated');
    }

    cli.close();
  });

  cli.on('close', () => process.exit(0));
}

async function main() {
  await installDependencies();
  copyFiles();
  updatePrompt();
}

main();
