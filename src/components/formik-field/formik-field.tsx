import React, { ReactElement, ChangeEvent, FocusEvent, FC } from 'react';
import { useField } from 'formik';

export type ExtendedComponentProps<FieldValue, ComponentProps> = ComponentProps & {
  error?: React.ReactNode;
  onChange?: (value: FieldValue, event: ChangeEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onClearClick?: () => void;
};

interface FormikFieldProps<FieldValue, ComponentProps> {
  name: string;
  component: FC<ComponentProps>;
  componentProps: ExtendedComponentProps<FieldValue, ComponentProps>;
  onChange?: (value: FieldValue, event: ChangeEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onClearClick?: () => void;
  className?: string;
  value?: string;
  validate?: (value: FieldValue) => string | void | Promise<string | void>;
  showErrorMessage: boolean;
}

export function FormikField<FieldValue, ComponentProps>({
  name,
  validate,
  showErrorMessage,
  className,
  component,
  componentProps,
  onChange,
  onBlur,
  onClearClick,
}: FormikFieldProps<FieldValue, ComponentProps>): ReactElement {
  const [field, meta, helpers] = useField<FieldValue>({
    name,
    validate,
  });

  const error = meta.touched ? (showErrorMessage ? meta.error : Boolean(meta.error)) : undefined;

  const preparedComponentProps = {
    className,

    ...field,
    ...componentProps,

    error,

    onChange: (value: FieldValue, event: ChangeEvent) => {
      helpers.setValue(value);

      if (componentProps.onChange) {
        componentProps.onChange(value, event);
      }

      onChange?.(value, event);
    },

    onBlur: (event: FocusEvent) => {
      field.onBlur(event);

      if (componentProps.onBlur) {
        componentProps.onBlur(event);
      }

      onBlur?.(event);
    },

    onClearClick: () => {
      if (componentProps.onClearClick) {
        componentProps.onClearClick();
      }

      onClearClick?.();
    },
  };

  return React.createElement(component, preparedComponentProps);
}

FormikField.defaultProps = {
  showErrorMessage: true,
  componentProps: {},
};
