# i18n-helpers

A set of helpers useful when introducing `i18n` internationalization to the application.

## Merge

Merges original internationalization file (usually english) and translation file. Both files have to be in `JSON` format.

This module is useful when searching for missing keys or when one wants to provide placeholders for missing keys. It also finds any keys that are existing in the translation and are missing in the original.

Generates either report or explicit list of keys.

### Usage

```

i18-helpers merge [-a | -p | -v | -i] original translation

```

### Minimal example

To run the merge in the simplest way, just provide paths to the original internationalization file and the translated one.

```

i18-helpers merge 'original.json' 'translation.json'

```

### Flags

The tool can be run with different flags:

| `-a,--append-original`            | Flag depicting that the original translation should be appended after the placeholder                         |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `-i,--indent [value]`             | Indentation value used for building the resulting file. Check `JSON.stringify` documentation for the details. |
| `-p,--placeholder [placeholder]`  | Custom placeholder. Default placeholder is `__I18N_MISSING__`                                                 |
| `-v,--verbose`                    | Generates verbose report containing list of keys in particular groups                                         |

### Example output

Merge command generates simple report about performed operations. Example below:

```

╔═════════════════════════╤═════╗
║ New keys                │ 126 ║
╟─────────────────────────┼─────╢
║ Existing keys           │ 422 ║
╟─────────────────────────┼─────╢
║ Skipped keys            │ 0   ║
╟─────────────────────────┼─────╢
║ Missing in the original │ 0   ║
╟─────────────────────────┼─────╢
║ Total                   │ 548 ║
╚═════════════════════════╧═════╝

```

* `New keys` is related to the keys missing in the translation
* `Existing keys` are the ones that are probably already translated and exist in the translation file
* `Skipped keys` are related to the ones that are inconsistent between original and translation (e.g. key in the original holds an object and in the translation is just a plain value)
* `Missing in the original` holds the number of the keys missing in the original that are existing in the translation
* `Total` is the sum of keys generated in the output

If the output indicates that some inconsistencies occurred (number of `skipped` or `missing` keys different than `0`), one can use `-v` flag to investigate problems.
