import React, { ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Formik, FormikProps, Form } from 'formik';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { uniqBy } from 'lodash';

import { useStyles } from 'lib/theme';

import { FormikField } from 'ui/formik-field';
import { Input, InputSize, InputWidth } from 'ui/input';
import { ButtonIcon } from 'ui/button-icon';
import { Button, ButtonSize, ButtonView } from 'ui/button';
import { Select, SelectSize } from 'ui/select';
import { NumberInput } from 'ui/number-input';
import { Textarea, TextareaSize, TextareaWidth } from 'ui/textarea';

import { editValueFormTexts } from 'texts';

import { EditDataField, EditDataValues, Props } from './types';

import { useStore } from '.';

import styles from './edit-value-form.pcss';

export const EditValueFormView = observer(({ connections }: Props): ReactElement => {
  const cn = useStyles(styles, 'edit-value-form');

  const store = useStore();
  const { currentKey, currentRedisId } = store;

  // ToDo: load key value if has current key

  const uniqConnections = uniqBy(connections, 'id');

  function handleSaveValue(values: EditDataValues): void {}

  function renderForm({ values, setFieldValue }: FormikProps<EditDataValues>): ReactNode {
    return (
      <Form className={cn('form')}>
        <div className={cn('create-wrap')}>
          {uniqConnections.length === 1 ? (
            uniqConnections[0].name
          ) : (
            <FormikField
              name={EditDataField.RedisId}
              component={Select}
              componentProps={{
                items: uniqConnections.map((conn) => ({
                  value: conn.id,
                  text: conn.name,
                })),
                size: SelectSize.M,
              }}
            />
          )}

          <Button icon={faSave} size={ButtonSize.M} view={ButtonView.Success}>
            {currentKey ? editValueFormTexts.saveBtn : editValueFormTexts.createBtn}
          </Button>
        </div>

        <div className={cn('key-wrap')}>
          <FormikField
            name={EditDataField.Key}
            component={Input}
            componentProps={{
              label: editValueFormTexts.keyLabel,
              size: InputSize.M,
              width: InputWidth.Available,
              disabled: !values.canEditKey,
              className: cn('key'),
            }}
          />

          {!values.canEditKey && (
            <ButtonIcon
              icon={faEdit}
              className={cn('edit-btn')}
              onClick={() => setFieldValue(EditDataField.CanEditKey, true)}
            />
          )}
        </div>

        <FormikField
          name={EditDataField.Ttl}
          component={NumberInput}
          componentProps={{
            label: editValueFormTexts.ttlLabel,
            size: InputSize.M,
            width: InputWidth.Available,
            className: cn('ttl'),
          }}
        />

        <FormikField
          name={EditDataField.Value}
          component={Textarea}
          componentProps={{
            label: editValueFormTexts.valueLabel,
            size: TextareaSize.M,
            width: TextareaWidth.Available,
            maxHeight: true,
            className: cn('textarea'),
          }}
        />
      </Form>
    );
  }

  return (
    <Formik<EditDataValues>
      initialValues={{
        redisId: currentRedisId || connections[0].id,
        key: '',
        canEditKey: !currentKey,
        value: '',
      }}
      onSubmit={handleSaveValue}
    >
      {renderForm}
    </Formik>
  );
});
