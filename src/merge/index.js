import asyncFs from 'fs';
import {promisifyAll} from 'bluebird';

import merge from './merge';

const fs = promisifyAll(asyncFs);

/**
 * CLI handler for merge operation
 * @param  {Array} files  Input files
 * @param  {Object} args  Console arguments
 * @return {Promise}      Result of the operation
 */
export default async function mergeCLI(files, args) {
  if (!files.length) {
    console.log(
      chalk`{green usage: i18-helpers merge [-a | -p] original translation}`);
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
  const placeholder = args.p | args.placeholder;
  const appendOriginal = args.a | args['append-original'];

  // Get the files
  let originalFile;
  let translationFile;

  try {
    originalFile = (await fs.readFileAsync(originalFileName)).toString();
  } catch (err) {
    throw new Error('Cannot read original file!');
  }

  try {
    translationFile = (await fs.readFileAsync(translationFileName)).toString();
  } catch (err) {
    throw new Error('Cannot read translation file!');
  }

  return await
    merge(originalFile, translationFile, placeholder, appendOriginal);
}
