import React, { ReactElement, ReactNode, useEffect } from 'react';
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
import { Spinner, SpinnerView } from 'ui/spinner';

import { editValueFormTexts } from 'texts';

import { useStore } from '.';

import { EditDataField, EditDataValues, Props } from './types';
import { validationSchema } from './validation';

import styles from './edit-value-form.pcss';

export const EditValueFormView = observer(({ connections }: Props): ReactElement => {
  const cn = useStyles(styles, 'edit-value-form');

  const store = useStore();
  const { currentKey, currentRedisId, keyData, isLoading, isSaving } = store;

  useEffect(() => {
    store.getKeyData();
  }, [currentKey?.join('-') || '']);

  useEffect(() => {
    return () => {
      store.dispose();
    };
  }, []);

  const uniqConnections = uniqBy(connections, 'id');

  function handleSaveValue(values: EditDataValues): void {
    store.saveValue(values);
  }

  function renderForm({ values, setFieldValue, dirty, isValid }: FormikProps<EditDataValues>): ReactNode {
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
                disabled: isSaving,
              }}
            />
          )}

          <Button
            icon={faSave}
            size={ButtonSize.M}
            view={ButtonView.Success}
            disabled={!dirty || !isValid}
            isLoading={isSaving}
          >
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
              disabled: !values.canEditKey || isSaving,
              className: cn('key'),
            }}
          />

          {!values.canEditKey && (
            <ButtonIcon
              icon={faEdit}
              className={cn('edit-btn')}
              disabled={isSaving}
              onClick={() => setFieldValue(EditDataField.CanEditKey, true)}
            />
          )}
        </div>

        <FormikField
          name={EditDataField.Ttl}
          component={NumberInput}
          componentProps={{
            label: editValueFormTexts.ttlLabel,
            hint: editValueFormTexts.ttlHint,
            size: InputSize.M,
            width: InputWidth.Available,
            disabled: isSaving,
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
            disabled: isSaving,
            className: cn('textarea'),
          }}
        />
      </Form>
    );
  }

  if (isLoading) {
    return <Spinner view={SpinnerView.Block} />;
  }

  return (
    <Formik<EditDataValues>
      initialValues={{
        redisId: currentRedisId || connections[0].id,
        key: keyData?.key || '',
        canEditKey: !currentKey,
        ttl: keyData?.ttl,
        value: keyData?.value || '',
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSaveValue}
    >
      {renderForm}
    </Formik>
  );
});
