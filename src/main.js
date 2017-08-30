#!/usr/bin/env node

import chalk from 'chalk';
import commandLineCommands from 'command-line-commands';
import minimist from 'minimist';

import packageFile from '../package.json';
import merge from './merge';
import convert from './convert';


const validCommands = [null, 'convert', 'merge'/* , 'translate' */];

const {
  command,
  argv,
} = commandLineCommands(validCommands);

const options = minimist(argv);

switch (command) {
    case 'convert':
        invokeConvertCommand(options);
        break;
    case 'merge':
        invokeMergeCommand();
        break;
    default:
        invokeDefaultCommand();
}

/**
 *
 * @param {Object} options
 */
async function invokeConvertCommand(options) {
    try {
        console.log(options);
        await convert(options.i, options.o, options.d);
    } catch (err) {
        exitWithError(err);
    }
}

/**
 *
 */
function invokeMergeCommand() {
    const options = minimist(argv);
    const files = options._;

    (async function() {
        try {
            await merge(files, options);
        } catch (err) {
            exitWithError(err);
        }
    })();
}

/**
 *
 */
function invokeDefaultCommand() {
    const options = minimist(argv);
    if (options.version || options.v) {
        console.log(chalk`{green version: ${packageFile.version}}`);
        process.exit(0);
    }

    console.log(chalk`{red valid commands:}
    {blue ${validCommands.splice(1).join(', ')}}`);
    process.exit(0);
}

function exitWithError(err) {
    console.log(chalk`{red ${err}}`);
    process.exit(1);
}