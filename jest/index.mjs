import { copyFiles, installDependencies, updateScripts } from '../common.mjs';

const dependencies = {
  '@types/jest': '^29.1.1',
  '@types/node': '^18.8.1',
  jest: '^29.1.2',
  prettier: '^2.7.1',
  'ts-jest': '^29.0.3',
  'ts-jest-resolver': '^2.0.0',
  'ts-node': '^10.9.1',
  typescript: '^4.8.4',
};

const files = ['jest.config.ts', 'tsconfig.json', '.prettierrc', '.npmignore'];
const scripts = {
  test: 'jest',
  tdd: 'jest --watchAll',
};

export async function main() {
  await installDependencies(dependencies);
  await copyFiles('jest', files);
  await updateScripts(scripts);
}
