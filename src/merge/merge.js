import {isUndefined, transform} from 'lodash';

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
  // Build entries object. Will be used for generating the report
  const entries = {
    existing: [],
    new: [],
    skipped: [],
  };

  const mergedTranslation = mergeTranslation(
    original, translation, entries, placeholder, appendOriginal);

  return {
    mergedTranslation,
    entries,
  };
}

/**
 * Called recursively to merge translations
 * @param  {Object} original Original Object
 * @param  {Object} target   Target Object
 * @param  {Object} entries  Entry numbers used for the report
 * @param  {String} placeholder Placeholder for missing keys
 * @param  {Boolean} appendOriginal Flag whether the original
 *   internationalization should be appended after the placeholder
 * @param  {String} path     Path to register different entry operations when
 *   called recursively
 * @return {Object}          Merged translation
 */
function mergeTranslation(
  original, target = {}, entries, placeholder, appendOriginal, path = '') {
  // Clone the original path
  path = String(path);

  // Transform original object into translation
  const mergedTranslation = transform(original, (result, value, key) => {
    const targetValue = target[key];

    // Recursive run - object encountered
    if (typeof value === 'object') {
      // If target value is existing and is not an object - skip it
      if (targetValue && typeof targetValue !== 'object') {
        entries.skipped.push(path + key);
        return result[key] = targetValue;
      }

      // Append new key to the originally passed path
      path += `${key}.`;
      return result[key] = mergeTranslation(
        value, targetValue, entries, placeholder, appendOriginal, path);
    }

    // Plain value
    if (isUndefined(targetValue)) {
      entries.new.push(path + key);
      return result[key] = appendOriginal ?
        `${placeholder} ${value}` :
        placeholder;
    }

    // Entries exist in both files, normal processing
    entries.existing.push(path + key);
    return result[key] = targetValue;
  }, {});

  return mergedTranslation;
}
