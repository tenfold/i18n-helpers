import {each, isUndefined, union} from 'lodash';

/**
 * Scans for the entries that exist in the translation,
 * but are missing in the original file
 * @param  {Object} original      Original i18n file
 * @param  {Object} translation   Translation i18n file
 * @param  {String} path          Path passed in recursive calls
 * @param  {Array} missingEntries Array of found missing entries
 * @return {Array}                All the paths that are missing in the original
 */
export default function scanMissing(original, translation,
  path = '', missingEntries = []) {
  // Clone the original path
  path = String(path);

  each(translation, (value, key) => {
    const originalValue = original[key];

    if (isUndefined(originalValue)) {
      return missingEntries.push(path + key);
    }

    if (typeof value === 'object') {
      missingEntries = union(missingEntries,
        scanMissing(originalValue, value, `${path}${key}.`, missingEntries));
    }
  });

  return missingEntries;
}
