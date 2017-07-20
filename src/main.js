import chalk from 'chalk';
import commandLineCommands from 'command-line-commands';

import merge from './merge';
import translate from './translate';

const validCommands = [null, 'merge', 'translate'];

const {
  command,
  argv,
} = commandLineCommands(validCommands);

if (command === null) {
  console.log(chalk`{red Valid commands:}
    {blue ${validCommands.splice(1).join(', ')}}`);
  process.exit(1);
}

if (command === merge) {

}

if (command === translate) {

}
