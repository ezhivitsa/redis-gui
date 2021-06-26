import React, { ReactElement } from 'react';

import { ConnectionFormikField } from 'stores';

import { FormikField } from 'components/formik-field';
import { Checkbox, CheckboxSize } from 'components/checkbox';

export function AuthenticationForm(): ReactElement {
  return (
    <div>
      <FormikField
        name={ConnectionFormikField.PerformAuth}
        component={Checkbox}
        componentProps={{
          label: 'Perform authentication',
          size: CheckboxSize.S,
        }}
      />
    </div>
  );
}
