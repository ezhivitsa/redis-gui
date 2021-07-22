import React, { ReactElement, ReactNode } from 'react';

import { Connection } from 'lib/db';

import { Table, TableSize } from 'ui/table';

enum Column {
  Name = 'name',
  Address = 'address',
  User = 'user',
}

interface Props {
  className?: string;
  list: Connection[];
  onConnectionClick: (connection: Connection) => void;
  onConnectionDoubleClick: (connection: Connection) => void;
  onResetConnection: () => void;
  active: Connection | null;
}

const columnName: Record<Column, string> = {
  [Column.Name]: 'Name',
  [Column.Address]: 'Address',
  [Column.User]: 'User',
};

export function ComponentsListTable({
  className,
  list,
  active,
  onConnectionClick,
  onConnectionDoubleClick,
  onResetConnection,
}: Props): ReactElement {
  function renderColumn(column: Column, item: Connection): ReactNode {
    switch (column) {
      case Column.Name:
        return item.main.name;

      case Column.Address:
        return '';
      // return `${item.host || ''}${item.post || ''}`.trim();

      case Column.User:
        return item.auth.username;
    }
  }

  return (
    <Table
      className={className}
      columns={[Column.Name, Column.Address, Column.User]}
      data={list}
      activeItem={active || undefined}
      renderColumn={renderColumn}
      heading={columnName}
      onRowClick={onConnectionClick}
      onRowDoubleClick={onConnectionDoubleClick}
      onClickOutside={onResetConnection}
      size={TableSize.S}
    />
  );
}
