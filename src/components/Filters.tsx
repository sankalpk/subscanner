import { useState, useEffect } from 'react';

import {
  EuiPopover,
  EuiPopoverTitle,
  EuiPopoverFooter,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiCheckboxGroup,
} from '@elastic/eui';
import { ScannedEvent } from '../utils/fetchBlockRange';

interface IFilters {
  events: Array<ScannedEvent>,
  onFilter: (events: Array<ScannedEvent>) => void
}

interface CheckboxMap {
  [key: string]: boolean
}
const Filters = (props: IFilters) => {
  const { events, onFilter } = props;

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [checkboxIdToSelectedMap, setCheckboxIdToSelectedMap] = useState<CheckboxMap>({});

  useEffect(() => {
    // Reset checked items if new events are fetched
    if (events.length === 0) {
      setCheckboxIdToSelectedMap({})
    }
  }, [events])

  const distinctMethods = Array.from(new Set(events.map(x => x.method)))
  const checkboxes = distinctMethods.map(method => ({ id: method, label: method }))

  const onChange = (optionId: string) => {
    const newCheckboxIdToSelectedMap = { ...checkboxIdToSelectedMap }
    newCheckboxIdToSelectedMap[optionId] = !checkboxIdToSelectedMap[optionId]
    setCheckboxIdToSelectedMap(newCheckboxIdToSelectedMap);
  };


  const onButtonClick = () =>
    setIsPopoverOpen((isPopoverOpen) => !isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  const handleSubmit = () => {
    // Get a list of filters that are checked
    const checkedFilters: Array<String> = [];
    for (const key in checkboxIdToSelectedMap) {
      if (checkboxIdToSelectedMap[key] === true) {
        checkedFilters.push(key)
      }
    }

    //Filter events by those filters
    const filteredEvents = events.filter(event =>
      checkedFilters.includes(event.method)
    )
    onFilter(filteredEvents)
  }

  return (
    <EuiFlexGroup justifyContent='flexEnd'>
      <EuiFlexItem grow={false}>
        <EuiPopover
          button={
            <EuiButtonEmpty
              iconType="arrowDown"
              iconSide="right"
              onClick={onButtonClick}
            >
              Filters
            </EuiButtonEmpty>
          }
          isOpen={isPopoverOpen}
          closePopover={closePopover}
          anchorPosition="upCenter"
        >
          <EuiPopoverTitle>Method</EuiPopoverTitle>
          <div className="filterContainer">
            <EuiText size="s">
              <EuiCheckboxGroup
                options={checkboxes}
                idToSelectedMap={checkboxIdToSelectedMap}
                onChange={(id) => onChange(id)}
              />
            </EuiText>
          </div>
          <EuiPopoverFooter>
            <EuiButton onClick={handleSubmit} fullWidth size="s">
              Submit
            </EuiButton>
          </EuiPopoverFooter>
        </EuiPopover>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default Filters;