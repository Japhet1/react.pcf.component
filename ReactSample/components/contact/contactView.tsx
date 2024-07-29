import * as React from 'react';
import { Contact } from '../../common/model';
import { Stack, StackItem } from '@fluentui/react/lib/Stack'
import { Panel, PanelContent, PanelHeader, PanelHeaderTitle } from 'pcf-components/lib/panel';
import { Text } from '@fluentui/react/lib/Text'
import { DummyContactData } from '../../SummaryContact';
import { Tag } from 'pcf-components';
import cmStyles from '../common.style'
import { mergeStyleSets } from '@fluentui/merge-styles';
import { Separator } from 'pcf-components/lib/separator/Separator';
import { ColumnView } from './columnView'
import { getRecordFormUrlFromLookup, getUserDateFormatForDateFNS } from 'pcf-core';
import format from 'date-fns/format'
import { Link } from '@fluentui/react';
import { ContactType } from '../../common/types';


const classNames = mergeStyleSets({
    container: {
        marginTop: '15px', // Adjust padding as needed
        // marginBottom: '15px',
    },
    span: {
        marginRight: '8px', // Space between spans
        backgroundColor: '#f4f4f4', // Gray background color
        padding: '4px',
    },
  });

const contentStyle = { root: { padding: 24 } };

export interface IContactViewProps {
    contact: DummyContactData;
    error: string;
    setError: (error: string) => void;
    onEdit: () => Promise<void>;
}

export const ContactView: React.FC<IContactViewProps> = (props) => {

    const { contact, error, setError, onEdit } = props

    return (
        <Panel>
            <PanelHeader>
                <Stack horizontal horizontalAlign='space-between' className={cmStyles.fullWidth} >
                    <StackItem>
                        <PanelHeaderTitle title='Contact snapshot' />
                    </StackItem>
                </Stack>
            </PanelHeader>
            <PanelContent >
                <Stack>
                    <StackItem>
                        <Text variant='xLarge'>{contact.fullname}</Text>
                        <div className={cmStyles.mt8}>
                            {/* <Tag text={contact.mictslos_contacttype.text} />&nbsp; <Tag text={contact.mictslos_category.text} /> */}
                            <Text variant='xSmall' className={classNames.span}>{contact.mictslos_contacttype[0].text}</Text>
                            <Text variant='xSmall' className={classNames.span}>{contact.mictslos_category[0].text}</Text>
                        </div>
                        <div className={cmStyles.mt8}>ID: <strong>{contact.mictslos_id}</strong></div>
                    </StackItem>
                    <Separator className={cmStyles.mt15} />
                    <Stack tokens={{ childrenGap: 16 }} className={cmStyles.mt15} >
                        {contact.mictslos_contacttype[0].key == ContactType.Individual && 
                            <>
                                <ColumnView label='Gender' iconName='People' value={contact.gendercode?.text} />
                                <ColumnView label='Date of birth' iconName='Calendar' value={contact.birthdate ? format(new Date(contact.birthdate), getUserDateFormatForDateFNS()) : ""} /> 
                            </>
                        }
                        <ColumnView label='Phone' iconName='Phone' value={<Link href={`tel:${contact.address1_telephone1}`}>{contact.address1_telephone1}</Link>} />
                        <ColumnView label='Email' iconName='Mail' value={<Link href={`mailto:${contact.emailaddress1}`}>{contact.emailaddress1}</Link>} />
                        <ColumnView label='Address' iconName='Home' value={<>{[contact.address1_line1, contact.address1_line2, contact.address1_city, contact.address1_country].filter((item) => item).map(e => <div key={e}>{e}</div>)}</>} />
                        <ColumnView label='Prefered method of contact' iconName='' value={contact.preferredcontactmethodcode.text} />
                        <Separator className={cmStyles.mb8} />
                        {contact.mictslos_contacttype[0].key == ContactType.Company ? 
                            (<>
                                <ColumnView label='Company registration number' iconName='' value={contact.mictslos_bizregistrationnumber} />
                                <ColumnView label='Company place of incoporation' iconName='' value={contact.mictslos_bizplaceofincorporation} />
                                <ColumnView label='Company operation' iconName='' value={contact.mictslos_bizoperation?.text} />
                                <ColumnView label='Year of operation' iconName='' value={contact.mictslos_bizyears} />
                            </>) :
                            (<>
                                <ColumnView label='Occupation' iconName='' value={contact.jobtitle} />
                                <ColumnView label="Employer's name" iconName='' value={contact.mictslos_employersname} />
                                <ColumnView label='Annual income' iconName='' value={contact.annualincome_base} />
                            </>)
                        }
                        <ColumnView label='Bank name' iconName='' value={contact.mictslos_bank ? <Link>{contact.mictslos_bank?.title}</Link> : ""} />
                        <ColumnView label='Bank Branch' iconName='' value={contact.mictslos_branch ? <Link>{contact.mictslos_branch?.title}</Link> : ""} />
                    </Stack>
                </Stack>
            </PanelContent>
        </Panel>
    )
}