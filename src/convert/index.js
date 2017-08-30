import fs from 'fs';
import Promise from 'bluebird';
import csvParse from 'csv-parse';
import _ from 'lodash';

const csvParseAsync = Promise.promisify(csvParse);
Promise.promisifyAll(fs);

/**
 * Parses CSV file and returns its contents
 *
 * @param {string} filename
 * @param {string} delimiter
 * @return {Promise.<Array>}
 */
async function readCsvFile(filename, delimiter) {
    const rawContents = await fs.readFileAsync(filename);
    return await csvParseAsync(rawContents, {
        delimiter,
    });
}

/**
 * @param {Array} items
 * @return {Object}
 */
function toJson(items) {
    return _.reduce(items, (result, item) => {
        const key = item[0].replace(/\//g, '.');
        _.set(result, `i18n.${key}`, item[1]);
        return result;
    }, {});
}

/**
 * Converts CSV file formatted as
 *  key/to/translation, "translation"
 * into i18next format
 *
 * @param {string} inputFile
 * @param {string} outputFile
 * @param {string} delimiter
 * @return {Promise.<void>}
 */
export default async function convert(inputFile, outputFile, delimiter = ',') {
    const items = await readCsvFile(inputFile, delimiter);
    const jsonAsString = JSON.stringify(toJson(items), null, 2);
    return await fs.writeFileAsync(outputFile, jsonAsString, 'utf8');
}
