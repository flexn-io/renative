#!/usr/bin/env node

'use strict';

var cli = require('@rnv/cli');

if (require.main === module) {
    cli.run();
}

module.exports = cli;
