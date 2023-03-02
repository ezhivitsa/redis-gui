import React, { ReactElement, ReactNode } from 'react';
import { FieldArray, FieldArrayRenderProps, FieldInputProps, FieldMetaProps, FieldHelperProps, useField } from 'formik';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { ConnectionType } from 'renderer/lib/db';
import { useStyles } from 'renderer/lib/theme';

import { FormikField } from 'renderer/ui/formik-field';
import { Select, SelectSize, SelectWidth } from 'renderer/ui/select';
import { Input, InputSize, InputWidth } from 'renderer/ui/input';
import { ButtonIcon, ButtonIconView } from 'renderer/ui/button-icon';
import { Button, ButtonSize } from 'renderer/ui/button';
import { Label, LabelSize } from 'renderer/ui/label';
import { Checkbox, CheckboxSize, CheckboxWidth } from 'renderer/ui/checkbox';

import {
  ConnectionFormikField,
  ConnectionAddressFormikField,
  ConnectionMainFormikField,
  ConnectionMainFormikValues,
} from 'renderer/scenes/connection-modal/types';

import { mainFormTexts } from 'texts';

import styles from './main-form.pcss';

interface Props {
  isSaving: boolean;
}

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

export function MainForm({ isSaving }: Props): ReactElement {
  const cn = useStyles(styles, 'connection-tab-form');

  const [typeField] = useMainField(ConnectionMainFormikField.Type);
  const [addressesField, , addressesFieldHelpers] = useMainField(ConnectionMainFormikField.Addresses);
  const [, , sentinelNameFieldHelpers] = useMainField(ConnectionMainFormikField.SentinelName);
  const [, , readOnlyFieldHelpers] = useMainField(ConnectionMainFormikField.ReadOnly);

  function handleTypeChange(type: string): void {
    if (type === ConnectionType.Direct) {
      addressesFieldHelpers.setValue(addressesField.value.slice(0, 1));
      readOnlyFieldHelpers.setValue(false);
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
            label: mainFormTexts.hostLabel,
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('host'),
            disabled: isSaving,
          }}
        />

        <FormikField
          name={`${getFieldName(ConnectionMainFormikField.Addresses)}.${index}.${ConnectionAddressFormikField.Port}`}
          component={Input}
          componentProps={{
            label: mainFormTexts.portLabel,
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('port'),
            disabled: isSaving,
          }}
        />

        {typeField.value !== ConnectionType.Direct && (
          <ButtonIcon
            icon={faTrashAlt}
            view={ButtonIconView.Danger}
            onClick={() => arrayHelpers.remove(index)}
            className={cn('remove-btn')}
            disabled={isSaving}
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
        <Button size={ButtonSize.S} onClick={() => arrayHelpers.push({})} disabled={isSaving}>
          {mainFormTexts.addBtn}
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
        {mainFormTexts.addresses}
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
          label: mainFormTexts.sentinelNameLabel,
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
          disabled: isSaving,
        }}
      />
    );
  }

  function renderReadOnlyField(): ReactNode {
    if (typeField.value === ConnectionType.Direct) {
      return null;
    }

    return (
      <FormikField
        name={getFieldName(ConnectionMainFormikField.ReadOnly)}
        component={Checkbox}
        componentProps={{
          label: mainFormTexts.readOnlyLabel,
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
          disabled: isSaving,
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
          label: mainFormTexts.typeLabel,
          size: SelectSize.S,
          items: [
            { value: ConnectionType.Direct, text: mainFormTexts.directConnection },
            { value: ConnectionType.Cluster, text: mainFormTexts.clusterConnection },
            { value: ConnectionType.Sentinel, text: mainFormTexts.sentinelConnection },
          ],
          width: SelectWidth.Available,
          className: cn('item'),
          onChange: handleTypeChange,
          disabled: isSaving,
        }}
      />

      <FormikField
        name={getFieldName(ConnectionMainFormikField.Name)}
        component={Input}
        componentProps={{
          label: mainFormTexts.nameLabel,
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
          disabled: isSaving,
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

      {renderReadOnlyField()}
    </div>
  );
}
