#!/usr/bin/env node
'use strict';

import { main as jest } from './jest/index.mjs';
import { main as karma } from './karma/index.mjs';
import { main as jasmine } from './jasmine/index.mjs';
import { createInterface } from 'readline';

function main(type = process.argv[2]) {
  switch (type) {
    case 'jasmine':
      jasmine();
      break;
    case 'karma':
      karma();
      break;
    case 'jest':
      jest();
      break;
    default:
      select();
      break;
  }
}

function select() {
  const tools = {
    1: 'jest',
    2: 'karma',
    3: 'jasmine',
  };

  const cli = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const options = Object.entries(tools)
    .map(([a, b]) => `  ${a}: ${b}`)
    .join('\n');

  cli.question(`Which tool to use? \n${options}\n> `, (answer) => {
    cli.close();
    main(tools[answer]);
  });
}

main();
