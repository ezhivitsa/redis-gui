import React, { ReactElement } from 'react';

import { ConnectionType } from 'lib/db';
import { useStyles } from 'lib/theme';

import { ConnectionFormikField } from 'stores';

import { FormikField } from 'components/formik-field';
import { Select, SelectSize, SelectWidth } from 'components/select';
import { Input, InputSize, InputWidth } from 'components/input';

import styles from './connection-tab-form.pcss';

export function ConnectionTabForm(): ReactElement {
  const cn = useStyles(styles, 'connection-tab-form');

  return (
    <div>
      <FormikField
        name={ConnectionFormikField.Type}
        component={Select}
        componentProps={{
          label: 'Type',
          size: SelectSize.S,
          items: [
            { value: ConnectionType.Direct, text: 'Direct Connection' },
            { value: ConnectionType.Cluster, text: 'Cluster Connection' },
          ],
          width: SelectWidth.Available,
          className: cn('item'),
        }}
      />

      <FormikField
        name={ConnectionFormikField.Name}
        component={Input}
        componentProps={{
          label: 'Name',
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
        }}
      />
    </div>
  );
}
