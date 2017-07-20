const inquirer = require('inquirer');

const {
  run
} = require('./src');

console.log('*** Welcome in i18n tag helper! Please give a translation prefix');

var questions = [
  {
    type: 'input',
    name: 'prefix',
    message: 'Translation JSON prefix'
  }
];

inquirer.prompt(questions).then((answers) => {
  let {prefix} = answers;
  prefix = prefix || 'i18n';

  console.log(`Running with prefix: ${prefix}`);

  run(prefix);
}).catch((err) => {
  console.log(err);
});
