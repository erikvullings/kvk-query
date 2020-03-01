# KVK-query

Command line interface (CLI) to query the Netherlands Chamber of Commerce (KvK - Kamer van Koophandel). Providing a list of KVK numbers, and a valid API key, generate a CSV and JSON output file containing the results obtained from a [profile search](https://developers.kvk.nl/documentation/search-profile-v2).

## Installation

Assuming you have [node.js](https://nodejs.org/) installed, you can install [kvk-query](https://www.npmjs.com/package/kvk-query) as a global command.

```bash
npm i -g kvk-query
```

## Usage

```bash
kvk-query # Run kvk-query without inputs to show help

Query KvK

  Queries the KvK (profile search) and returns the results in JSON and CSV
  format.

Options

  -h, --help boolean              Display the help text.
  -k, --key string                API key, can also be set via environment property, KVK_API_KEY.
  -d, --decimalSeparator string   CSV decimal separator: comma (default) or dot.
  -c, --columnSeparator string    CSV column separator: semi-column (default), colon or tab.
  -n, --kvk string                Comma-separated list of KvK numbers to query.
  -o, --output string             Output filename, default SOURCE_FILENAME_result with extension CSV or JSON.
  -s, --src string                Relative path to the source file with KvK numbers in the first column.

Examples

  01. Perform a simple query       $ kvk-query -k KVK_API_KEY -n 50045857
  02. Perform two queries          $ kvk-query -k KVK_API_KEY -n 50045857, 50595547
  03. Run multiple queries         $ kvk-query -k KVK_API_KEY ./sample/kvk.csv
  04. Specify output and options   $ kvk-query -k KVK_API_KEY .samplekvk.csv -o test -d . -c
```

## Development

Install dependencies using `npm i` or (my personal preference, `pnpm`, installed using `npm i -g pnpm`) `pnpm i`.

```bash
npm start
```

The application does four things:

- Process the command line options
- Obtain the KvK numbers to query
- Perform the query against the KVK database (assuming you have a valid API license key, which can be obtained from [here](https://developers.kvk.nl/))
- Save the output to CSV and JSON.
