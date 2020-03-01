export interface IAddress {
  type: string;
  bagId?: string;
  street: string;
  houseNumber: string;
  houseNumberAddition?: string;
  postalCode: string;
  city: string;
  country: string;
  rijksdriehoekX?: number;
  rijksdriehoekY?: number;
  rijksdriehoekZ?: number;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

export interface IKvKProfile {
  kvkNumber: string;
  branchNumber: string;
  rsin: string;
  tradeNames: {
    businessName: string;
    shortBusinessName: string;
    currentTradeNames: string[];
    currentStatutoryNames: string[];
  };
  hasEntryInBusinessRegister: boolean;
  hasNonMailingIndication: boolean;
  isLegalPerson: boolean;
  legalForm?: string;
  isBranch: boolean;
  isMainBranch: boolean;
  hasCommercialActivities: string;
  employees: number;
  foundationDate: string;
  registrationDate: string;
  businessActivities: Array<{
    sbiCode: string;
    sbiCodeDescription: string;
    isMainSbi: boolean;
  }>;
  addresses: Array<IAddress>;
  websites: string[];
}

export interface IKvKProfileResult {
  apiVersion: string;
  meta: object;
  data: {
    /** Amount of search results per page used for the query */
    itemsPerPage: number;
    /** The current page of the results */
    startPage: number;
    /** Total amount of results spread over multiple pages */
    totalItems: number;
    /** Link to next set of ItemsPerPage result items */
    nextLink: string;
    /** Link to previous set of ItemsPerPage result items */
    previousLink: string;
    /** Original query */
    query: string;
    /** Actual search results */
    items: IKvKProfile[];
  };
}
