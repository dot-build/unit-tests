#!/usr/bin/env node
'use strict';

import { copyFiles, installDependencies, updateScripts } from '../common.mjs';

const dependencies = {
  jasmine: '^4.3.0',
  nodemon: '^2.0.6',
  nyc: '^15.1.0',
  'ts-node': '^10.9.1',
  tslib: '^2.4.0',
  typescript: '^4.1.3',
  prettier: '^2.3.2',
};

const files = ['jasmine.json', 'tsconfig.json', 'tsconfig.spec.json', '.prettierrc'];

const scripts = {
  test: './node_modules/.bin/ts-node -P ./tsconfig.spec.json -- ./node_modules/jasmine/bin/jasmine --config=./jasmine.json',
  tdd: "./node_modules/.bin/nodemon -w src -w test -e ts -x 'npm run test'",
  coverage: './node_modules/.bin/nyc -r html -e .ts -x "src/*.spec.ts" npm run test',
};

export async function main() {
  await installDependencies(dependencies);
  await copyFiles('jasmine', files);
  await updateScripts(scripts);
}
