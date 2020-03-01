import { ICommandOptions } from './models/command-options';
import * as path from 'path';
import * as fs from 'fs';

/** Process the input file or command line and return a list of KvK numbers */
export const parseInputs = (inputs: ICommandOptions) => {
  if (inputs.kvk) {
    return inputs.kvk.filter(k => !isNaN(+k)).map(k => +k);
  }
  if (inputs.src) {
    const file = path.resolve(process.cwd(), inputs.src);
    if (!fs.existsSync(file)) {
      console.error(`Cannot find ${file}!`);
      process.exit(1);
    }
    const kvkStr = fs.readFileSync(file).toString();
    return kvkStr.split(/\r\n|\n|;/).filter(k => k && !isNaN(+k)).map(k => +k);
  }
};
