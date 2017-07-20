/**
 * Merges original internationalization file with the translation
 * Adds placeholder for missing keys
 *
 * @param  {Object} original                         Original Object
 * @param  {Object} translation                      Translated i18n object
 * @param  {String} [placeholder='__I18N_MISSING__'] Placeholder for
 *   missing keys
 * @param  {Boolean} appendOriginal                  Flag whether the original
 *   internationalization should be appended after the placeholder
 * @return {Promise}                                 Result of the operation
 */
export default async function merge(
  original, translation, placeholder = '__I18N_MISSING__', appendOriginal) {

}
