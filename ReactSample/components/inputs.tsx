import { Field } from 'formik';
import { FormikAsyncDropdown, FormikAsyncDropdownProps } from 'pcf-components/lib/formikInputs/inputs/FormikAsyncDropdown';
import { FormikDatePicker, FormikDatePickerProps } from 'pcf-components/lib/formikInputs/inputs/FormikDatePicker';
import { FormikDropdown, FormikDropdownProps } from 'pcf-components/lib/formikInputs/inputs/FormikDropdown';
import { FormikTextField, FormikTextProps } from 'pcf-components/lib/formikInputs/inputs/textfield';
import * as React from 'react';


export type FieldTextProps = Omit<FormikTextProps,"field" | "meta" | "form">
export const FieldText: React.FC<FieldTextProps> = (props) => {
    return (
        <Field
            maxLength={255}
            {...props}
            component={FormikTextField}
        />
    );
}

export type FieldDatePickerProps = Omit<FormikDatePickerProps, "field" | "meta" | "form">
export const FieldDatePicker: React.FC<FieldDatePickerProps> = (props) => {
    return (
        <Field
            {...props}
            component={FormikDatePicker}
        />
    );
}

export type FieldDropdownProps = Omit<FormikDropdownProps, "field" | "meta" | "form">

export const FieldDropdown: React.FC<FieldDropdownProps> = (props) => {
    return (
        <Field
            {...props}
            component={FormikDropdown}
        />
    );
}

export type FieldAsyncDropdownProps = Omit<FormikAsyncDropdownProps, "field" | "meta" | "form"> 

export const FieldAsyncDropdown: React.FC<FieldAsyncDropdownProps> = (props) => {
    return (
        <Field
            {...props}
            component={FormikAsyncDropdown}
        />
    );
}