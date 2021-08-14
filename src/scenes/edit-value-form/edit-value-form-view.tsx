import React, { ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Formik, FormikProps, Form } from 'formik';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

import { useStyles } from 'lib/theme';

import { FormikField } from 'ui/formik-field';
import { Input, InputSize, InputWidth } from 'ui/input';
import { ButtonIcon } from 'ui/button-icon';
import { Button, ButtonSize, ButtonView } from 'ui/button';
import { Select } from 'ui/select';

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
          {/* {!currentKey} */}

          <Button icon={faSave} size={ButtonSize.M} view={ButtonView.Success}>
            {currentKey ? 'Save' : 'Create'}
          </Button>
        </div>

        <div className={cn('key-wrap')}>
          <FormikField
            name={EditDataField.Key}
            component={Input}
            componentProps={{
              label: 'Key',
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
      </Form>
    );
  }

  return (
    <div>
      <Formik<EditDataValues> initialValues={{ key: '', canEditKey: false, value: '' }} onSubmit={handleSaveValue}>
        {renderForm}
      </Formik>
    </div>
  );
});
