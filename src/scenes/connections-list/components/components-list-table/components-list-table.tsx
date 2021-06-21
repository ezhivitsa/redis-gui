import React, { ReactElement, ReactNode } from 'react';

import { Connection } from 'lib/db';

import { Table, TableSize } from 'components/table';

enum Column {
  Name = 'name',
  Address = 'address',
  User = 'user',
}

interface Props {
  list: Connection[];
  onConnectionClick: (connection: Connection) => void;
}

const columnName: Record<Column, string> = {
  [Column.Name]: 'Name',
  [Column.Address]: 'Address',
  [Column.User]: 'User',
};

export function ComponentsListTable({ list, onConnectionClick }: Props): ReactElement {
  function renderColumn(column: Column, item: Connection): ReactNode {
    switch (column) {
      case Column.Name:
        return item.name;

      case Column.Address:
        return `${item.host || ''} ${item.post || ''}`.trim();

      case Column.User:
        return item.username;
    }
  }

  return (
    <Table
      columns={[Column.Name, Column.Address, Column.User]}
      data={list}
      renderColumn={renderColumn}
      heading={columnName}
      onRowClick={onConnectionClick}
      size={TableSize.S}
    />
  );
}
