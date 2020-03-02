import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { ICommandOptions, IKvKProfileResult, IKvKProfile } from './models';
import { padLeft } from './utils';

// https://api.kvk.nl/api/v2/profile/companies?user_key=KVK_API_KEY&&kvkNumber=10030057


/** Query the KvK and return a promise */
const query = (user_key: string, kvk: number, startPage?: number) => {
  const kvkNumber = padLeft(kvk, '0', 8);
  return axios
    .get('https://api.kvk.nl/api/v2/profile/companies', {
      params: {
        user_key,
        kvkNumber,
        startPage,
      },
      timeout: 600000,
    })
    .catch(err => console.error(`Cannot get kvk number: ${kvkNumber} (${err}).`)) as AxiosPromise<IKvKProfileResult>;
};

/**
 * Query the KvK synchronously.
 * For every hit with multiple items (i.e. branches), retreive them immediately too.
 */
export const runQuery = async (inputs: ICommandOptions, kvkNumbers: number[]) => {
  const result = [] as IKvKProfile[];
  for (let i = 0; i < kvkNumbers.length; i++) {
    const res = await query(inputs.key, kvkNumbers[i]);
    if (res && res.data && res.data.data) {
      const kvkItem = res.data.data;
      const { totalItems, itemsPerPage, items } = kvkItem;
      result.push(...items);
      if (totalItems > itemsPerPage) {
        const kvk = +items[0].kvkNumber;
        for (let i = 2; i <= totalItems; i += itemsPerPage) {
          const subRes = await query(inputs.key, kvk, i);
          if (subRes && subRes.data && subRes.data.data && subRes.data.data.items) {
            result.push(...subRes.data.data.items);
          }
        }
      }
    }
  }
  return result;
};

/**
 * Query the KvK async and return the results as object
 * @deprecated Although this works in principle, the KVK REST service will very quickly
 * generate internal server errors when many (50?) or more queries are performed at once.
 */
export const runQueryAsync = async (inputs: ICommandOptions, kvk: number[]) => {
  return new Promise<IKvKProfileResult[]>(resolve => {
    axios.all(kvk.map(n => query(inputs.key, n))).then(
      axios.spread((...res: Array<AxiosResponse<IKvKProfileResult>>) => {
        const kvkItems = res.filter(r => r && r.data).map(r => r.data);
        const links = kvkItems.reduce((acc, cur) => {
          if (cur.data && cur.data.items.length > 0) {
            const { totalItems, itemsPerPage, items } = cur.data;
            const kvk = +items[0].kvkNumber;
            if (totalItems > itemsPerPage) {
              for (let i = 2; i <= totalItems; i += itemsPerPage) {
                acc.push({ kvk, startPage: i });
              }
            }
          }
          return acc;
        }, [] as Array<{ kvk: number; startPage: number }>);
        axios.all(links.map(n => query(inputs.key, n.kvk, n.startPage))).then(
          axios.spread((...res2: Array<AxiosResponse<IKvKProfileResult>>) => {
            const result = [...kvkItems, ...res2.filter(r => r && r.data).map(r => r.data)]
              .filter(r => r.data && r.data.items.length > 0)
              .sort((a, b) =>
                +a.data.items[0].kvkNumber > +b.data.items[0].kvkNumber
                  ? 1
                  : +a.data.items[0].kvkNumber < +b.data.items[0].kvkNumber
                  ? -1
                  : 0
              );
            resolve(result);
          })
        );
      })
    );
  });
};
