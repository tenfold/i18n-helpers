import chalk from 'chalk';
import {
  table,
  getBorderCharacters,
} from 'table';

/**
 * Generates console output with the merge summary
 * @param  {Object} entries   Merged entry keys
 * @param  {Boolean} verbose  Flag whether the result should be verbose
 */
export default function report(entries, verbose) {
  console.log(chalk`{green merge complete.}`);

  if (verbose) {
    console.log(chalk`{bold new keys:}` + '\n' +
      entries.new.join(',\n'));
    console.log(chalk`{bold existing keys:}` + '\n' +
      entries.existing.join(',\n'));
    console.log(chalk`{bold skipped keys:}` + '\n' +
      entries.skipped.join(',\n'));
    console.log(chalk`{bold missing in the original:}` + '\n' +
      entries.missing.join(',\n'));
    console.log(chalk`{bold total: }` +
      (+entries.new.length + entries.existing.length + entries.skipped.length));
    return;
  }

  const data = [
    [chalk`{bold New keys}`, entries.new.length],
    [chalk`{bold Existing keys}`, entries.existing.length],
    [chalk`{bold Skipped keys}`, entries.skipped.length],
    [chalk`{bold Missing in the original}`, entries.missing.length],
    [chalk`{bold Total}`,
      entries.new.length + entries.existing.length + entries.skipped.length],
  ];

  const config = {
    border: getBorderCharacters(`honeywell`),
  };

  console.log(table(data, config));
}
