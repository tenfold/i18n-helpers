const _ = require('lodash');
const fs = require('fs');

const {
  saveOutputFile,
  saveTranslations
} = require('./files');

const INPUT_DIR = './input'

/**
 * Runs the translation replacer
 * @param  {String} prefix Prefix to use for translation keys
 */
function run(prefix) {
  let allTranslations = [];

  const inputFiles = fs.readdirSync('./input');

  console.log(`Found ${inputFiles.length} files.`);
  for (let inputFile of inputFiles) {
    const fileContents = fs.readFileSync(`./input/${inputFile}`);

    console.log(`\n********* TRANSLATING ${inputFile} *********`);
    const translations = searchForTranslations(fileContents, prefix);

    console.log(`\n********* SAVING output/${inputFile} *********`);
    saveOutputFile(fileContents, translations, inputFile);

    console.log(`\n********* MERGING TRANSLATIONS *********`);
    allTranslations = _.concat(allTranslations, translations);
  }

  console.log(`\n********* SAVING translations/${prefix}.json *********`);
  saveTranslations(allTranslations, prefix);

  console.log(`\n ********* DONE *********`)
}

/**
 * Searches for translation fields in the given text
 * @param  {String} text   Input text
 * @param  {String} prefix Prefix to use
 * @return {String}        Array of translations
 */
function searchForTranslations(text, prefix) {
  // "Tooltip" attribute occurences
  const tooltipRegex = new RegExp(`(?:tooltip=")((?!${prefix}\.)(\\w|\\s|\.)+?)(?:")`, 'g');
  const tooltipReplacementFunction = (text, context, key) => ` ng-i18next="[tooltip]${key}"`;
  const tooltips = getTranslatedElements(tooltipRegex, text, prefix, tooltipReplacementFunction);

  console.log(`Found ${tooltips.length} tooltip attributes to translate`);

  // "Title" attribute occurences
  const titleRegex = new RegExp(`(?:title=")((?!${prefix}\.)(\\w|\\s|\.)+?)(?:")`, 'g');
  const titleReplacementFunction = (text, context, key) => ` ng-i18next="[title]${key}"`;
  const titles = getTranslatedElements(titleRegex, text, prefix);

  console.log(`Found ${titles.length} title attributes to translate`);

  // Occurences in tags
  const tagRegex = new RegExp(`(?:>\\n*)((?!<|${prefix}\.)(\\w|\\s|\\.)+?)(?:\\n*<)`, 'g');
  const tagReplacementFunction = (text, context, key) => ` ng-i18next="${key}"><`;
  const tags = getTranslatedElements(tagRegex, text, prefix, tagReplacementFunction);

  console.log(`Found ${tags.length} tags with text to translate`);

  const translations = _.concat(tooltips, titles, tags);
  console.log(`Merged the translation objects. Total: ${translations.length}`);

  return translations;
}

/**
 * Gets translation object based on given regExp
 * @param  {RegExp} regExp Regexp to search for elements
 * @param  {String} text   Text to find objects to translate in
 * @param  {String} prefix Prefix to use when building
 * @return {Array}         Detected translations
 */
function getTranslatedElements(regExp, text, prefix, replacementFunction) {
  const elements = [];

  let result;
  while(result = regExp.exec(text)){
    const translationEntry = buildTranslationObject(prefix, result, replacementFunction);
    if (translationEntry) {
      elements.push(translationEntry);
    }
  }

  return elements;
}

/**
 * Builds single translation entry for further processing
 * @param  {String} prefix Translation prefix
 * @param  {Object} result RegExp result
 * @return {Object}        Resulting object
 */
function buildTranslationObject (prefix, result, replacementFunction) {
  const text = _.trim(result[1]);
  const context = result[0];

  if (text !== '') {
    const key = `${prefix}.${_.kebabCase(text)}`;
    const object = {
      key,
      context,
      text
    }

    if (replacementFunction) {
      object.replacement = replacementFunction(text, context, key);
    }

    return object;
  }
}

module.exports = {
  run
};
