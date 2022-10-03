import { copyFiles, installDependencies, updateScripts } from '../common.mjs';

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

const files = ['jest.config.ts', 'tsconfig.json', '.prettierrc'];
const scripts = {
  test: 'jest',
  tdd: 'jest --watchAll',
};

export async function main() {
  await installDependencies(dependencies);
  await copyFiles('jest', files);
  await updateScripts(scripts);
}
