import { useState } from "react";
import { EuiProgress } from '@elastic/eui';

import Form from './Form'
import Table from './Table'
import Filters from './Filters';
import { fetchBlockRange, IFetchBlockRange, ScannedEvent } from "../utils/fetchBlockRange";


const Scanner = () => {
  const [scanning, setScanning] = useState(false)
  const [events, setEvents] = useState<ScannedEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<ScannedEvent[]>([])

  const handleScan = async (args: IFetchBlockRange) => {
    setScanning(true)
    setEvents([])
    setFilteredEvents([])
    try {
      const fetchedEvents = await fetchBlockRange(args)
      setEvents(fetchedEvents)
      setFilteredEvents(fetchedEvents)
    } catch (error) {
      console.error('Unable to fetch', error);
      setEvents([])
      setFilteredEvents([])
    }
    setScanning(false)
  }

  return (
    <>
      <Form onScan={handleScan} scanning={scanning} />
      {scanning ? <EuiProgress size="xs" color="primary" /> : null}
      <div className="filters">
        <Filters events={events} onFilter={setFilteredEvents} />
      </div>
      <Table events={filteredEvents} />
    </>
  )
}

export default Scanner;