#!/usr/bin/env node
'use strict';

import { main as jest } from './jest/index.mjs';
import { main as karma } from './karma/index.mjs';

const type = process.argv[2];

switch (type) {
  case 'karma':
    karma();
    break;
  case 'jest':
  default:
    jest();
    break;
}
