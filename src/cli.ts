import * as path from 'path';
import * as dotenv from 'dotenv';
import { ICommandOptions } from './models/command-options';
import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import { parseInputs } from './parse-inputs';
import { runQuery } from './run-query';
import { saveOutputs } from './save-outputs';

/** Load config file */
dotenv.config();

/**
 * Adds missing properties from typings.
 */
export interface FixedOptionDefinition extends OptionDefinition {
  description: string;
  typeLabel: string;
}

export class CommandLineInterface {
  static optionDefinitions: FixedOptionDefinition[] = [
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      typeLabel: 'boolean',
      description: 'Display the help text.',
    },
    {
      name: 'key',
      alias: 'k',
      type: String,
      typeLabel: 'string',
      description: 'API key, can also be set via environment property, KVK_API_KEY.',
    },
    {
      name: 'decimalSeparator',
      alias: 'd',
      type: String,
      typeLabel: 'string',
      defaultValue: ',',
      description: 'CSV decimal separator: comma (default) or dot.',
    },
    {
      name: 'columnSeparator',
      alias: 'c',
      type: String,
      typeLabel: 'string',
      defaultValue: ';',
      description: 'CSV column separator: semi-column (default), colon or tab.',
    },
    {
      name: 'kvk',
      alias: 'n',
      type: String,
      multiple: true,
      typeLabel: 'string',
      description: 'Comma-separated list of KvK numbers to query.',
    },
    {
      name: 'output',
      alias: 'o',
      type: String,
      typeLabel: 'string',
      description: 'Output filename, default SOURCE_FILENAME_result with extension CSV or JSON.',
    },
    {
      name: 'src',
      alias: 's',
      type: String,
      typeLabel: 'string',
      defaultOption: true,
      description: 'Relative path to the source file with KvK numbers in the first column.',
    },
  ];

  static sections = [
    {
      header: 'Query KvK',
      content:
        'Queries the KvK (profile search) and returns the results in JSON and CSV format.',
    },
    {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions,
    },
    {
      header: 'Examples',
      content: [
        {
          desc: '01. Perform a simple query',
          example: '$ kvk-query -k KVK_API_KEY -n 50045857',
        },
        {
          desc: '02. Perform two queries',
          example: '$ kvk-query -k KVK_API_KEY -n 50045857, 50595547',
        },
        {
          desc: '03. Run multiple queries',
          example: '$ kvk-query -k KVK_API_KEY ./sample/kvk.csv',
        },
        {
          desc: '04. Specify output and options',
          example: '$ kvk-query -k KVK_API_KEY .\sample\kvk.csv -o test -d . -c \t',
        },
      ],
    },
  ];
}

const options = commandLineArgs(CommandLineInterface.optionDefinitions) as ICommandOptions;
if (!options.key) {
  options.key = process.env.KVK_API_KEY;
}
if ((!options.src && !options.kvk) || !options.key) {
  console.error('Supplied options: ');
  console.error(options);
  console.error('\nNo source specified.\n');
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(1);
}
if (!options.output && !options.kvk) {
  const ext = path.extname(options.src);
  const outputFile = path.resolve(process.cwd(), options.src).replace(RegExp(`${ext}$`, 'i'), '_result');
  options.output = outputFile;
}

const run = async () => {
  const kvk = parseInputs(options);
  const items = await runQuery(options, kvk);
  saveOutputs(options, items);
};

run();