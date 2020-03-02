import { ICommandOptions, IKvKProfile, IAddress } from './models';
import * as path from 'path';
import * as fs from 'fs';
import { padLeft } from './utils';

const decimalSeparator = (inputs: ICommandOptions) => (n?: number) =>
  n ? (inputs.decimalSeparator === ',' ? n.toString().replace(/[.]/, ',') : n) : undefined;

const json2csv = (inputs: ICommandOptions, items: IKvKProfile[], cb: (result: string) => void) => {
  const decSep = decimalSeparator(inputs);
  const res = items.reduce(
    (acc, it) => {
      const addr1 = it.addresses && it.addresses.length > 0 ? it.addresses[0] : ({} as IAddress);
      const addr2 = it.addresses && it.addresses.length > 1 ? it.addresses[1] : ({} as IAddress);
      return [
        ...acc,
        [
          padLeft(it.kvkNumber, '0', 8),
          padLeft(it.branchNumber, '0', 12),
          it.rsin,
          it.tradeNames.businessName,
          it.tradeNames.shortBusinessName,
          it.tradeNames.currentTradeNames ? it.tradeNames.currentTradeNames.join(', ') : undefined,
          it.tradeNames.currentStatutoryNames ? it.tradeNames.currentStatutoryNames.join(', ') : undefined,
          it.legalForm,
          it.businessActivities ? it.businessActivities.map(s => s.sbiCode).join(', ') : undefined,
          it.businessActivities ? it.businessActivities.map(s => s.sbiCodeDescription).join(', ') : undefined,
          it.businessActivities ? it.businessActivities.map(s => s.isMainSbi).join(', ') : undefined,
          it.hasEntryInBusinessRegister,
          it.hasCommercialActivities,
          it.hasNonMailingIndication,
          it.isLegalPerson,
          it.isBranch,
          it.isMainBranch,
          it.employees,
          it.foundationDate,
          it.registrationDate,
          addr1.type,
          addr1.bagId,
          addr1.street,
          addr1.houseNumber,
          addr1.houseNumberAddition,
          addr1.postalCode,
          addr1.city,
          addr1.country,
          decSep(addr1.gpsLatitude),
          decSep(addr1.gpsLongitude),
          addr1.rijksdriehoekX,
          addr1.rijksdriehoekY,
          addr1.rijksdriehoekZ,
          addr2.type,
          addr2.bagId,
          addr2.street,
          addr2.houseNumber,
          addr2.houseNumberAddition,
          addr2.postalCode,
          addr2.city,
          addr2.country,
          decSep(addr2.gpsLatitude),
          decSep(addr2.gpsLongitude),
          addr2.rijksdriehoekX,
          addr2.rijksdriehoekY,
          addr2.rijksdriehoekZ,
          it.websites ? it.websites.join(', ') : '',
        ],
      ];
    },
    [
      [
        'kvkNumber',
        'branchNumber',
        'rsin',
        'businessName',
        'shortBusinessName',
        'currentTradeNames',
        'currentStatutoryNames',
        'legalForm',
        'sbiCodes',
        'sbiCodeDescriptions',
        'isMainSbis',
        'hasEntryInBusinessRegister',
        'hasCommercialActivities',
        'hasNonMailingIndication',
        'isLegalPerson',
        'isBranch',
        'isMainBranch',
        'employees',
        'foundationDate',
        'registrationDate',
        'address1type',
        'address1bagId',
        'address1street',
        'address1houseNumber',
        'address1houseNumberAddition',
        'address1postalCode',
        'address1city',
        'address1country',
        'address1gpsLatitude',
        'address1gpsLongitude',
        'address1rijksdriehoekX',
        'address1rijksdriehoekY',
        'address1rijksdriehoekZ',
        'address2type',
        'address2bagId',
        'address2street',
        'address2houseNumber',
        'address2houseNumberAddition',
        'address2postalCode',
        'address2city',
        'address2country',
        'address2gpsLatitude',
        'address2gpsLongitude',
        'address2rijksdriehoekX',
        'address2rijksdriehoekY',
        'address2rijksdriehoekZ',
        'websites',
      ],
    ]
  );
  const csv = res.map(row => row.join(inputs.columnSeparator)).join('\r\n');
  cb(csv);
};

/** Save the outputs as JSON and as CSV */
export const saveOutputs = (inputs: ICommandOptions, kvkProfiles: IKvKProfile[]) => {
  if (inputs.kvk) {
    return console.log(JSON.stringify(kvkProfiles, null, 2));
  }
  const ext = path.extname(inputs.output);
  const outputFile = path.resolve(process.cwd(), inputs.output).replace(RegExp(`${ext}$`, 'i'), '');
  const jsonFile = outputFile + '.json';
  fs.writeFile(jsonFile, JSON.stringify(kvkProfiles), err => {
    if (err) {
      return console.error(err);
    }
    console.log(`JSON output written to ${jsonFile}.`);
  });
  const csvFile = outputFile + '.csv';
  json2csv(inputs, kvkProfiles, csv => {
    fs.writeFile(csvFile, csv, err => {
      if (err) {
        return console.error(err);
      }
      console.log(`CSV output written to ${csvFile}.`);
    });
  });
};
