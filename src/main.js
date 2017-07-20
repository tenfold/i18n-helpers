import chalk from 'chalk';
import commandLineCommands from 'command-line-commands';
import minimist from 'minimist';

import packageFile from '../package.json';
import merge from './merge';

const validCommands = [null, 'merge'/* , 'translate' */];

const {
  command,
  argv,
} = commandLineCommands(validCommands);

if (command === null) {
  const options = minimist(argv);
  if (options.version || options.v) {
    console.log(chalk`{green Version: ${packageFile.version}}`);
    process.exit(0);
  }

  console.log(chalk`{red Valid commands:}
    {blue ${validCommands.splice(1).join(', ')}}`);
  process.exit(1);
}

if (command === 'merge') {
  const options = minimist(argv);
  console.log(options);
}
