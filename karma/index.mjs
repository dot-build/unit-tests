import { copyFiles, installDependencies, updateScripts } from '../common.mjs';

const dependencies = {
  '@types/jasmine': '^4.3.0',
  '@types/node': '^18.7.16',
  jasmine: '^4.4.0',
  karma: '^6.4.0',
  'karma-chrome-launcher': '^3.1.1',
  'karma-jasmine': '^5.1.0',
  'karma-typescript': '^5.5.3',
  'karma-typescript-es6-transform': '^5.5.3',
  puppeteer: '^17.1.3',
  'ts-node': '^10.9.1',
  typescript: '^4.8.2',
};

const files = ['karma.conf.js', 'tsconfig.json', 'tsconfig.spec.json', '.prettierrc', 'test.js'];

const scripts = {
  test: 'karma start --single-run',
  tdd: 'karma start --auto-watch --reporters dots',
};

export async function main() {
  await installDependencies(dependencies);
  await copyFiles('karma', files);
  await updateScripts(scripts);
}
