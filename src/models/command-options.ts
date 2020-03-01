export interface ICommandOptions {
  /** API key, can also be set via environment property, KVK_API_KEY */
  key?: string;
  /** Show help */
  help?: boolean;
  /** Source CSV file, containing the KVK numbers to look for */
  src: string;
  /** Comma separated KVK numbers to lookup and export */
  kvk?: string[];
  /** Output filename, default same as the input filename with extension CSV and JSON. */
  output?: string;
  /** Decimal separator, by default a comma, but can also be a dot. */
  decimalSeparator: ',' | '.';
  /** Column separator, by default a semi-column, but can also be a colon or tab. */
  columnSeparator: ';' | ':' | '\t';
}
