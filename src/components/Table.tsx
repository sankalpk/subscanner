import { ReactNode, useState } from 'react';
import {
  Direction,
  EuiBasicTable,
  EuiDescriptionList,
  EuiPanel,
} from '@elastic/eui';
import ReactJson from 'react-json-view'
import { isNumber } from 'lodash';
import { isValidJson } from '../utils/typeValidation';
import { CriteriaWithPagination } from '@elastic/eui/src/components/basic_table';

import { ScannedEvent } from '../utils/fetchBlockRange';
import { SortField, convertStringToSortField } from '../utils/typeValidation'


interface ITable {
  events: ScannedEvent[]
}

interface TItemIdToExpandedRowMap {
  [id: number | string]: ReactNode;
}

const Table = (props: ITable) => {
  const { events } = props;

  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<TItemIdToExpandedRowMap>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('blockNumber');
  const [sortDirection, setSortDirection] = useState<Direction>('desc');

  const onTableChange = (props: CriteriaWithPagination<ScannedEvent>) => {
    setPageIndex(props.page?.index || 0);
    setPageSize(props.page?.size || 10);
    setSortField(convertStringToSortField(props.sort?.field.toString()))
    setSortDirection(props.sort?.direction || 'desc');
  };

  const firstItemIndex = pageSize * pageIndex
  const sortedEvents = events.sort((a, b) => {
    const fieldA = a[sortField]
    const fieldB = b[sortField]

    if (isNumber(fieldA) && isNumber(fieldB) && sortDirection === 'asc') {
      return parseInt(fieldA.toString()) - parseInt(fieldB.toString())
    }
    if (isNumber(fieldA) && isNumber(fieldB) && sortDirection === 'desc') {
      return parseInt(fieldB.toString()) - parseInt(fieldA.toString())
    }
    if (sortDirection === 'asc') {
      return fieldA.toString().localeCompare(fieldB.toString())
    }
    if (sortDirection === 'desc') {
      return fieldB.toString().localeCompare(fieldA.toString())
    }
    return 0
  })
  const pageOfItems = sortedEvents.slice(firstItemIndex, firstItemIndex + pageSize)


  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount: events.length,
    pageSizeOptions: [10, 25, 100],
    hidePerPageOptions: true,
  };

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
    enableAllColumns: true,
  };

  const getRowProps = (item: ScannedEvent) => {
    const { id, details, eventArgs } = item;
    return {
      onClick: () => {
        if (itemIdToExpandedRowMap[id]) {
          setItemIdToExpandedRowMap({})
          return;
        }
        const expand: TItemIdToExpandedRowMap = {};
        const listItems: Array<{ title: NonNullable<ReactNode>; description: NonNullable<ReactNode> }> = [
          {
            title: 'Details',
            description: details || '',
          },
        ];
        eventArgs.forEach((tuple) => {
          if (isValidJson(tuple[1])) {
            listItems.push({
              title: tuple[0],
              description: <ReactJson src={JSON.parse(tuple[1])} />
            })
          } else {
            listItems.push({
              title: tuple[0],
              description: tuple[1]
            })
          }
        })
        expand[id] = (
          <EuiDescriptionList listItems={listItems} />
        )
        setItemIdToExpandedRowMap(expand)
      },
    };
  };

  const columns = [
    {
      field: 'blockNumber',
      name: 'Block #',
    },
    {
      field: 'section',
      name: 'Section',
    },
    {
      field: 'method',
      name: "Method",
    },
  ];

  return (
    <EuiPanel className="table-panel" hasBorder={true}>
      <EuiBasicTable
        itemId="id"
        items={pageOfItems}
        columns={columns}
        isExpandable={true}
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
        rowProps={getRowProps}
        pagination={pagination}
        onChange={onTableChange}
        sorting={sorting}
      />
    </EuiPanel>
  );
};
export default Table;