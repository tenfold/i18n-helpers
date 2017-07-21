import asyncFs from 'fs';
import chalk from 'chalk';
import {promisifyAll} from 'bluebird';

import merge from './merge';
import report from './report';
import scanMissing from './scan-missing';

const fs = promisifyAll(asyncFs);
const OUTPUT_DIR = './output';

/**
 * CLI handler for merge operation
 * @param  {Array} files  Input files
 * @param  {Object} args  Console arguments
 */
export default async function mergeCLI(files, args) {
  if (!files.length) {
    console.log(chalk`{green usage: i18-helpers merge}` +
      chalk`{green  [-a | -p | -v | -i] original translation}`);
    return;
  }

  if (files.length < 2) {
    console.log(
      chalk`{red missing argument - please specify translation file!}`);
    return;
  }

  // Files
  const originalFileName = files[0];
  const translationFileName = files[1];

  // Arguments
  const appendOriginal = args.a || args['append-original'];
  const indentation = args.i || args.indent || 2;
  const placeholder = args.p || args.placeholder;
  const verbose = args.v || args.verbose;

  // Get the files
  const original = await getFile(originalFileName);
  const translation = await getFile(translationFileName);

  const {
    mergedTranslation,
    entries,
  } = merge(original, translation, placeholder, appendOriginal);

  entries.missing = scanMissing(original, translation);

  // Simply write the file into a new directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(chalk`{green output dir does not exist, creating...}`);
    fs.mkdirSync(OUTPUT_DIR);
  }
  await fs.writeFileAsync(`${OUTPUT_DIR}/${translationFileName}`,
    JSON.stringify(mergedTranslation, null, indentation));

  report(entries, verbose);
}

/**
 * Gets JSON file based on passed filename/path
 * @param  {String} fileName    File name or the path
 * @return {Promise<Object>}    Parsed JS object
 */
async function getFile(fileName) {
  let file;
  try {
    file = (await fs.readFileAsync(fileName)).toString();

    try {
      file = JSON.parse(file);
    } catch (err) {
      throw new Error(`File ${fileName} is not a valid JSON: ${err}`);
    }
  } catch (err) {
    throw new Error(`Cannot read file ${fileName}!`);
  }

  return file;
}
