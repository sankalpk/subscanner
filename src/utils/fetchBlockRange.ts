import 'regenerator-runtime/runtime'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { mapLimit, asyncify } from 'async';

interface IFetchBlockData {
  api: ApiPromise,
  blockNumber: number
}
export interface ScannedEvent {
  id: number,
  blockNumber: number,
  section: string,
  method: string,
  details: string | null,
  eventArgs: Array<[string, string]>
}
const fetchBlockData = async (props: IFetchBlockData): Promise<ScannedEvent[]> => {
  const { api, blockNumber } = props;
  const blockHash = await api.rpc.chain.getBlockHash(blockNumber);

  const events = await api.query.system.events.at(blockHash)
  const returnEvents: ScannedEvent[] = [];
  events.forEach((record) => {
    const { event } = record;
    const types = event.typeDef;
    let docs = null
    try {
      docs = event.meta.docs[0].toString()
    } catch (err) {
      console.error(err)
    }
    const randomId = Math.floor(Math.random() * 10000000000000000000000000);
    const returnObj: ScannedEvent = { id: randomId, blockNumber: blockNumber, section: event.section, method: event.method, details: docs, eventArgs: [] }

    event.data.forEach((data, index) => {
      returnObj.eventArgs.push([
        types[index].type,
        data.toString()
      ])
    });
    returnEvents.push(returnObj)
  });
  return returnEvents;
}

export interface IFetchBlockRange {
  start: number,
  end: number,
  providerUrl: string
}

export const fetchBlockRange = async (props: IFetchBlockRange): Promise<ScannedEvent[]> => {
  const { start, end, providerUrl } = props
  // Connect to node
  const wsProvider = new WsProvider(providerUrl);
  const api = await ApiPromise.create({ provider: wsProvider });

  // Turn block numbers into an array
  const blockNumbers = Array.from(new Array(end - start + 1), (x, i) => (start + i))
    .map((blockNumber) => ({ api: api, blockNumber: blockNumber }))

  // Fetch async parallel
  const results: ScannedEvent[][] = await mapLimit(blockNumbers, 50, asyncify(fetchBlockData))
  return results.flat()
}

export const fetchLastBlockNumber = async (providerUrl: string): Promise<string> => {
  const wsProvider = new WsProvider(providerUrl);
  const instance = new ApiPromise({ provider: wsProvider })
  return await instance.isReadyOrError
    .then(async (api) => {
      const lastHeader = await api.rpc.chain.getHeader();
      return lastHeader.number.toString();
    })
    .catch(error => {
      throw error
    })
}

export default fetchBlockRange;