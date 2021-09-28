import { useState, useEffect } from 'react';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiButton,
  EuiFieldText,
} from '@elastic/eui';
import { fetchLastBlockNumber, IFetchBlockRange } from '../utils/fetchBlockRange';

interface IForm {
  onScan: (args: IFetchBlockRange) => void,
  scanning: boolean
}

const Form = (props: IForm) => {
  const { onScan, scanning } = props;

  const [endpoint, setEndpoint] = useState('wss://rpc.polkadot.io');
  const [endpointError, setEndpointError] = useState([] as string[])
  const [startBlock, setStartBlock] = useState('')
  const [startBlockError, setStartBlockError] = useState([] as string[])
  const [endBlock, setEndBlock] = useState('');
  const [endBlockError, setEndBlockError] = useState([] as string[])
  const [fetchingEndBlock, setFetchingEndBlock] = useState({ url: '', fetching: false })

  async function fetchEndBlock() {
    // Avoid fetching the same URL in a row
    if (fetchingEndBlock.url === endpoint) {
      return;
    }
    setFetchingEndBlock({ url: endpoint, fetching: true })
    setEndpointError([])
    try {
      const lastBlockNumber = await fetchLastBlockNumber(endpoint)
      setEndBlock(lastBlockNumber)
    } catch (error) {
      const endpointErrorCopy: string[] = endpointError.slice()
      endpointErrorCopy.push('Unable to connect')
      setEndpointError(endpointErrorCopy)
    }
    setFetchingEndBlock({ url: endpoint, fetching: false })
  }

  useEffect(() => {
    fetchEndBlock();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEndpointChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEndpoint(e.currentTarget.value)
  }

  const handleStartBlockChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStartBlock(e.currentTarget.value)
  }

  const handleEndBlockChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEndBlock(e.currentTarget.value)
  }

  const handleScan = () => {
    if (validForm()) {
      onScan({ start: parseInt(startBlock), end: parseInt(endBlock), providerUrl: endpoint })
    }
  }

  const validForm = () => {
    const newStartBlockErrors = []
    const newEndblockErrors = []
    if (startBlock === '') {
      newStartBlockErrors.push('Required')
    }
    if (endBlock === '') {
      newEndblockErrors.push('Required')
    }
    if (startBlock !== '' && !parseInt(startBlock)) {
      newStartBlockErrors.push('Not a number')
    }
    if (endBlock !== '' && !parseInt(endBlock)) {
      newEndblockErrors.push('Not a number')
    }
    if (parseInt(startBlock) > parseInt(endBlock)) {
      newStartBlockErrors.push('Must be less than end block')
    }
    setStartBlockError(newStartBlockErrors)
    setEndBlockError(newEndblockErrors)
    if (newStartBlockErrors.length === 0 && newEndblockErrors.length === 0 && endpointError.length === 0) {
      return true;
    }
    return false;
  }

  return (
    <div className="form-panel-layout">
      <EuiFlexGroup style={{ maxWidth: 1200 }}>
        <EuiFlexItem>
          <EuiFormRow label="Endpoint URL" error={endpointError} isInvalid={endpointError.length > 0}>
            <EuiFieldText isInvalid={endpointError.length > 0} onBlur={fetchEndBlock} value={endpoint} onChange={handleEndpointChange} />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFormRow label="Start Block" error={startBlockError} isInvalid={startBlockError.length > 0}>
            <EuiFieldText isInvalid={startBlockError.length > 0} value={startBlock} onChange={handleStartBlockChange} />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFormRow label="End Block" error={endBlockError} isInvalid={endBlockError.length > 0}>
            <EuiFieldText isInvalid={endBlockError.length > 0} value={endBlock} disabled={fetchingEndBlock.fetching} isLoading={fetchingEndBlock.fetching} onChange={handleEndBlockChange} />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFormRow hasEmptyLabelSpace>
            <EuiButton disabled={scanning} onClick={handleScan}>Scan</EuiButton>
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  )
};

export default Form;