import React, { ReactElement, ReactNode } from 'react';
import { FieldArray, FieldArrayRenderProps, FieldInputProps, FieldMetaProps, FieldHelperProps, useField } from 'formik';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { ConnectionType } from 'lib/db';
import { useStyles } from 'lib/theme';

import {
  ConnectionFormikField,
  ConnectionAddressFormikField,
  ConnectionMainFormikField,
  ConnectionMainFormikValues,
} from 'stores';

import { FormikField } from 'components/formik-field';
import { Select, SelectSize, SelectWidth } from 'components/select';
import { Input, InputSize, InputWidth } from 'components/input';
import { ButtonIcon, ButtonIconView } from 'components/button-icon';
import { Button, ButtonSize } from 'components/button';
import { Label, LabelSize } from 'components/label';
import { Checkbox, CheckboxSize, CheckboxWidth } from 'components/checkbox';

import styles from './main-form.pcss';

function getFieldName(field: ConnectionMainFormikField): string {
  return `${ConnectionFormikField.Main}.${field}`;
}

export function useMainField<Field extends ConnectionMainFormikField>(
  field: Field,
): [
  FieldInputProps<ConnectionMainFormikValues[Field]>,
  FieldMetaProps<ConnectionMainFormikValues[Field]>,
  FieldHelperProps<ConnectionMainFormikValues[Field]>,
] {
  return useField<ConnectionMainFormikValues[Field]>(getFieldName(field));
}

export function MainForm(): ReactElement {
  const cn = useStyles(styles, 'connection-tab-form');

  const [typeField] = useMainField(ConnectionMainFormikField.Type);
  const [addressesField, , addressesFieldHelpers] = useMainField(ConnectionMainFormikField.Addresses);
  const [, , sentinelNameFieldHelpers] = useMainField(ConnectionMainFormikField.SentinelName);

  function handleTypeChange(type: string): void {
    if (type === ConnectionType.Direct) {
      addressesFieldHelpers.setValue(addressesField.value.slice(0, 1));
    }

    if (type !== ConnectionType.Sentinel) {
      sentinelNameFieldHelpers.setValue('');
    }
  }

  function renderAddressField(index: number, arrayHelpers: FieldArrayRenderProps): ReactNode {
    return (
      <div key={index} className={cn('address')}>
        <FormikField
          name={`${getFieldName(ConnectionMainFormikField.Addresses)}.${index}.${ConnectionAddressFormikField.Host}`}
          component={Input}
          componentProps={{
            label: 'Host',
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('host'),
          }}
        />

        <FormikField
          name={`${getFieldName(ConnectionMainFormikField.Addresses)}.${index}.${ConnectionAddressFormikField.Port}`}
          component={Input}
          componentProps={{
            label: 'Port',
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('port'),
          }}
        />

        {typeField.value !== ConnectionType.Direct && (
          <ButtonIcon
            icon={faTrashAlt}
            view={ButtonIconView.Danger}
            onClick={() => arrayHelpers.remove(index)}
            className={cn('remove-btn')}
          />
        )}
      </div>
    );
  }

  function renderAddressActions(arrayHelpers: FieldArrayRenderProps): ReactNode {
    if (typeField.value === ConnectionType.Direct) {
      return null;
    }

    return (
      <div className={cn('add-btn-wrap')}>
        <Button size={ButtonSize.S} onClick={() => arrayHelpers.push({})}>
          Add
        </Button>
      </div>
    );
  }

  function renderAddressesLabel(): ReactNode {
    if (typeField.value === ConnectionType.Direct) {
      return null;
    }

    return (
      <Label size={LabelSize.S} className={cn('addresses-label')}>
        Addresses:
      </Label>
    );
  }

  function renderSentinelNameField(): ReactNode {
    if (typeField.value !== ConnectionType.Sentinel) {
      return null;
    }

    return (
      <FormikField
        name={getFieldName(ConnectionMainFormikField.SentinelName)}
        component={Input}
        componentProps={{
          label: 'Sentinel Name',
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
        }}
      />
    );
  }

  return (
    <div>
      <FormikField
        name={getFieldName(ConnectionMainFormikField.Type)}
        component={Select}
        componentProps={{
          label: 'Type',
          size: SelectSize.S,
          items: [
            { value: ConnectionType.Direct, text: 'Direct Connection' },
            { value: ConnectionType.Cluster, text: 'Cluster Connection' },
            { value: ConnectionType.Sentinel, text: 'Sentinel Connection' },
          ],
          width: SelectWidth.Available,
          className: cn('item'),
          onChange: handleTypeChange,
        }}
      />

      <FormikField
        name={getFieldName(ConnectionMainFormikField.Name)}
        component={Input}
        componentProps={{
          label: 'Name',
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
        }}
      />

      {renderSentinelNameField()}

      <FieldArray
        name={getFieldName(ConnectionMainFormikField.Addresses)}
        render={(arrayHelpers) => (
          <>
            {renderAddressesLabel()}
            {addressesField.value.map((_, index) => renderAddressField(index, arrayHelpers))}
            {renderAddressActions(arrayHelpers)}
          </>
        )}
      />

      <FormikField
        name={getFieldName(ConnectionMainFormikField.ReadOnly)}
        component={Checkbox}
        componentProps={{
          label: 'Read Only Connection',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
        }}
      />
    </div>
  );
}
