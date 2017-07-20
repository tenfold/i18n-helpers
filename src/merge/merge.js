import {transform} from 'lodash';

/**
 * Merges original internationalization file with the translation
 * Adds placeholder for missing keys
 *
 * @param  {Object} original                         Original object String
 * @param  {Object} translation                      Translated i18n
 *   object String
 * @param  {String} [placeholder='__I18N_MISSING__'] Placeholder for
 *   missing keys
 * @param  {Boolean} appendOriginal                  Flag whether the original
 *   internationalization should be appended after the placeholder
 * @return {Promise}                                 Result of the operation
 */
export default function merge(
  original, translation, placeholder = '__I18N_MISSING__', appendOriginal) {
  // Check if passed files are valid JSON
  try {
    original = JSON.parse(original);
  } catch (err) {
    throw new Error(`Original file is not a valid JSON: ${err}`);
  }
  try {
    translation = JSON.parse(translation);
  } catch (err) {
    throw new Error(`Translation file is not a valid JSON: ${err}`);
  }

  return mergeTranslation(original, target, placeholder, appendOriginal);
}

/**
 * Called recursively to merge translations
 * @param  {Object} original Original Object
 * @param  {Object} target   Target Object
 * @param  {String} [placeholder='__I18N_MISSING__'] Placeholder for
 *   missing keys
 * @param  {Boolean} appendOriginal                  Flag whether the original
 *   internationalization should be appended after the placeholder
 * @return {Object}          Merged translation
 */
function mergeTranslation(original, target, placeholder, appendOriginal) {
  return transform(original, (key, value) => {

  }, {});
}

// function generateReport() {
//
// }
