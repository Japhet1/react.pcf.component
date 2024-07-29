import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import * as React from 'react';
import { LifeEvent, LifeEventTable } from '../../common/model';
import cmstyles from '../common.style';
import { Formik, FormikProps } from 'formik';
import { Loading } from 'pcf-components/lib/loading/Loading';
import { IChoice, IObjectHash, Localization, getOptionSet } from 'pcf-core';
import { dlgStyles, modalPropsStyles } from '../../common/style';
import { Stack, StackItem } from '@fluentui/react/lib/Stack';
import { BlockedMessageBar } from 'pcf-components/lib/dialogs';
import { MessageBarType } from '@fluentui/react/lib/MessageBar';
import { LifeEventContext } from '../../contextProviders/lifeEventContext';
import { IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';
import { FieldDatePicker, FieldDropdown, FieldText } from '../inputs';
import { useAsync } from 'pcf-components/lib/hooks';
import { FormikValidityObserver } from 'pcf-components/lib/formikInputs/FormikValidityObserver';
import { Label } from '@fluentui/react';


const gap24 = { childrenGap: 24 }
const gap10 = { childrenGap: 10 };

// Define props interface for LifeEventForm component
export interface ILifeEventFormProps {
    onCancel: () => void;
    event: LifeEvent;
    onAfterSave: (event: LifeEvent, updating: boolean) => void;
    contactFullname: string
}

// Define the LifeEventForm functional component
export const LifeEventForm: React.FC<ILifeEventFormProps> = (props) => {
    const { event } = props;

    // State hooks for loading state and Formik reference
    const [isLoading, setIsLoading] = React.useState(true);
    const formRef = React.useRef<FormikProps<IObjectHash>>();

    // LifeEventTable instance
    const table = new LifeEventTable();

    // Option set reference
    const typeOptionSet = React.useRef<IChoice[]>();

    // Show type flag
    const showCategory = React.useRef(!event.mictslos_category);

    const [isValid, setIsValid] = React.useState(false);

    // LifeEventContext
    const context = React.useContext(LifeEventContext);

    // Dialog content properties
    const dialogContentProps = {
        type: DialogType.normal,
        title: event.mictslos_category ? event.mictslos_category.text : 'Create event',
    };

    const validityCallback = React.useCallback((isValid: boolean) => {
        setIsValid(isValid);
    }, []);

    // Async hook for save operation
    const [execute, pending, value, error] = useAsync(async () => {
        const isNew = event.isNew();
        event.setValues(formRef.current.values);
        event.mictslos_name = event.mictslos_category.text + ' (' + props.contactFullname + ')';
        await table.saveRecord(event, { silent: false });
        props.onAfterSave(event, !isNew);
    });

    // Function to save the form
    const saveForm = () => {
        if (formRef.current) {
            const errorKeys = Object.keys(formRef.current.errors);
            if (errorKeys.length > 0) {
                let element = document.querySelector(`.${cmstyles.formikForm} [name="${errorKeys[0]}"],.${cmstyles.formikForm} #${errorKeys[0]}`);
                if (element && element instanceof HTMLElement) {
                    element.focus();
                }
            } else {
                execute();
            }
        }
    };

    // Effect hook to fetch option sets
    React.useEffect(() => {
        const fn = async () => {
            const types = await getOptionSet(table.LogicalName, 'mictslos_eventtype');
            typeOptionSet.current = types;
            setIsLoading(false);
        };
        fn();
    }, [context.categories]);

    // Render the LifeEventForm component
    return (
        <Dialog
            hidden={false}
            onDismiss={props.onCancel}
            dialogContentProps={dialogContentProps}
            modalProps={{
                isBlocking: true,
                styles: modalPropsStyles,
            }}
            maxWidth={493}
            minWidth={288}
            styles={dlgStyles}
        >
            <Loading text={Localization.getString('LoadingText')} isLoading={pending || isLoading}>
                {error != null && <BlockedMessageBar message={error.message} messageBarType={MessageBarType.error} />}
                <MemoizedForm
                    event={event}
                    formRef={formRef}
                    showCategory={showCategory.current}
                    validityCallback={validityCallback}
                    typeOptionSet={typeOptionSet.current}
                />
            </Loading>
            <DialogFooter>
                <PrimaryButton onClick={saveForm} text={Localization.getString("Save")} disabled={!isValid} />
                <DefaultButton onClick={props.onCancel} text={Localization.getString("Cancel")} />
            </DialogFooter>
        </Dialog>
    );
};

interface IMemoizedForm {
    event: LifeEvent;
    formRef: React.MutableRefObject<FormikProps<{}>>
    showCategory: boolean;
    validityCallback: (isValid: boolean) => void;
    typeOptionSet: IChoice[];
}
const MemoizedForm: React.FC<IMemoizedForm> = React.memo((props) => {
    const { event, formRef, showCategory, typeOptionSet } = props;
    const context = React.useContext(LifeEventContext);

    // Function to get type options based on category
    const getTypeOtions = (values) => {
        if (values.mictslos_category) {
            const v = values.mictslos_category.key.toString();
            return typeOptionSet.filter((e) => e.key.toString().startsWith(v) || e.key == 1) as IDropdownOption<any>[];
        }
        return [];
    };

    return <Formik
        validateOnMount={true}
        initialValues={event.writableFields}
        enableReinitialize={true}
        validationSchema={event.validate()}
        innerRef={formRef}
        onSubmit={() => { }}
        component={({ values, touched, errors, ...formprops }) => (<>
            <Stack className={cmstyles.formikForm} tokens={gap24}>
                <Stack>
                    {showCategory && <Label required>{Localization.getString('LifeEvent.categoryAndevent')}</Label>}
                    <Stack horizontal tokens={gap10}>
                        {showCategory && (
                            <StackItem className={cmstyles.width50}>
                                <FieldDropdown
                                    name='mictslos_category'
                                    label={""}
                                    options={context.categories as IDropdownOption<any>[]}
                                    required />
                            </StackItem>
                        )}
                        <StackItem className={showCategory? cmstyles.width50: cmstyles.fullWidth}>
                            <FieldDropdown
                                name='mictslos_eventtype'
                                label={showCategory ? "" : Localization.getString('LifeEvent.eventtype')}
                                options={getTypeOtions(values)}
                                disabled={!(values as any).mictslos_category}
                                placeholder={Localization.getString('LifeEvent.eventtypeplaceholder')}
                                required
                            />
                        </StackItem>
                    </Stack>
                </Stack>
                <StackItem>
                    <FieldText
                        name='mictslos_detail'
                        label={Localization.getString('LifeEvent.detail')} />
                </StackItem>
                <StackItem>
                    <FieldDatePicker
                        name='mictslos_eventdate'
                        label={Localization.getString('LifeEvent.eventdate')}
                        required />
                </StackItem>
            </Stack>
            <FormikValidityObserver callback={props.validityCallback} />
        </>
        )}
    />
}, (prev, current) => prev.typeOptionSet == current.typeOptionSet)