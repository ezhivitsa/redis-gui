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
// import {} from 'ui/te'

import { editValueFormTexts } from 'texts';

import { EditDataField, EditDataValues, Props } from './types';

import { useStore } from '.';

import styles from './edit-value-form.pcss';

export const EditValueFormView = observer(({ connections }: Props): ReactElement => {
  const cn = useStyles(styles, 'edit-value-form');

  const store = useStore();
  const { currentKey, currentRedis } = store;

  function handleSaveValue(values: EditDataValues): void {}

  function renderForm({ values, setFieldValue }: FormikProps<EditDataValues>): ReactNode {
    return (
      <Form>
        <div className={cn('create-wrap')}>
          {connections.length === 1 ? (
            connections[0].name
          ) : (
            <FormikField
              name={EditDataField.RedisId}
              component={Select}
              componentProps={{
                items: uniqBy(
                  connections.map((conn) => ({
                    value: conn.id,
                    text: conn.name,
                  })),
                  'value',
                ),
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
          }}
        />

        {/* <FormikField name={EditDataField.Value} component={} /> */}
      </Form>
    );
  }

  return (
    <div>
      <Formik<EditDataValues>
        initialValues={{ redisId: connections[0].id, key: '', canEditKey: false, value: '' }}
        onSubmit={handleSaveValue}
      >
        {renderForm}
      </Formik>
    </div>
  );
});
