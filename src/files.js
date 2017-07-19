const _ = require('lodash');
const fs = require('fs');

const OUTPUT_DIR = './output';
const TRANSLATIONS_DIR = './translations';

/**
 * Saves output file with texts replaced with translations
 * @param  {String} text          Original text
 * @param  {Array} translations   Detected translations
 * @param  {String} fileName      Original fileName
 */
function saveOutputFile(text, translations, fileName) {
  text = new String(text); // Clone the input

  for (let translation of translations) {
    const regExp = new RegExp(translation.context, 'ig');
    text = text.replace(regExp,
      translation.context.replace(translation.text, translation.key));
  }
  console.log('Translations injected into original file.');

  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log('Output dir does not exist, creating...');
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.writeFileSync(`${OUTPUT_DIR}/${fileName}`, text);

  console.log(`Output saved as 'output/${fileName}'`);
}

/**
 * Saves translation JSON to the disk
 * @param  {Array} translations   Detected translations
 * @param  {String} prefix        Prefix to use for building the JSON
 */
function saveTranslations(translations, prefix) {
  translations = _.uniqBy(translations, 'key');
  console.log(`Merged unique keys. Number of translations: ${translations.length}`);

  const output = {};
  _.each(translations, function(translation) {
    _.set(output, translation.key, translation.text);
  });

  console.log(`Output prepared.`);

  if (!fs.existsSync(TRANSLATIONS_DIR)) {
    console.log('Translations dir does not exist, creating...');
    fs.mkdirSync(TRANSLATIONS_DIR);
  }

  fs.writeFileSync(`${TRANSLATIONS_DIR}/${prefix}.json`, JSON.stringify(output, null, 4));
}

module.exports = {
  saveOutputFile,
  saveTranslations
};
