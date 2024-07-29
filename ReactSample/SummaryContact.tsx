import * as React  from 'react';
import { ContactView } from './components/contact/contactView';
import { Grid, GridCell, GridRow } from 'pcf-components/lib/grid';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { Contact, ContactTable } from './common/model'
import { DialogPageType, IEntityRecordDialogOptions, openDialogForm, Service} from 'pcf-core';
// import DummyData from './dummy.json'
import { ContactType } from './common/types';
import { LifeEvents } from './components/lifeEvent/LifeEvents';
import { FinancialHolding } from './components/financialHolding.ts/FinancialHolding';



export interface DummyContactData {
    fullname: string,
    mictslos_id: string,
    emailaddress1: string,
    address1_telephone1: string,
    address1_city: string,
    address1_country: string,
    address1_line1: string,
    address1_line2: string,
    annualincome_base: string,
    jobtitle: string,
    mictslos_branch: {title: string},
    mictslos_bank: {title: string},
    gendercode: {text: string},
    mictslos_category: {key: number, text: string}[],
    mictslos_contacttype: {key: number, text: string}[],
    birthdate: string,
    mictslos_employersname: string,
    mictslos_bizoperation: {text: string},
    mictslos_bizplaceofincorporation: string,
    mictslos_bizregistrationnumber: string,
    mictslos_bizyears: string,
    mictslos_joindate: string,
    preferredcontactmethodcode: {text: string}
}

const classNames = mergeStyleSets({
    snapshot: {
        minWidth: '250px',
        // border: 'black'
    },
    right: {
        minWidth: '250px',
        maxWidth: '100%'
    }
})

export interface ISummaryContactProps {

}

export const SummaryContact: React.FC<ISummaryContactProps> = (props) => {
    const [contact, setContact] = React.useState({
        "fullname": "Japhet Passah",
        "mictslos_id": "jap001",
        "emailaddress1": "japh@gmail.com",
        "address1_telephone1": "0234567123",
        "address1_city": "Madina",
        "address1_country": "Ghana",
        "address1_line1": "",
        "address1_line2": "",
        "annualincome_base": "30000",
        "jobtitle": "Software developer",
        "mictslos_branch": {"title": "Achimota"},
        "mictslos_bank": {"title": "UBA"},
        "gendercode": {"text": "Male"},
        "mictslos_category":[{ "key": 1, "text": "Customer"}, { "key": 2, "text": "Non-Customer"}],
        "mictslos_contacttype": [{ "key": 1, "text": "Individual"}, { "key": 2, "text": "Company"}],
        "birthdate": "5 Feb 2000",
        "mictslos_employersname": "MICTS",
        "mictslos_bizoperation": {"text": ""},
        "mictslos_bizplaceofincorporation": "empty",
        "mictslos_bizregistrationnumber": "empty",
        "mictslos_bizyears": "2024",
        "mictslos_joindate": "23 July 2021",
        "preferredcontactmethodcode": {"text": "Any"}
    })
    const [error, setError] = React.useState<string | null>(null)

    const table = new ContactTable()

    const onEdit = React.useCallback(async () => {
        await openDialogForm({
            entityId: Service.entity.entityId,
            entityName: 'contact',
            pageType: DialogPageType.EntityRecord
        } as IEntityRecordDialogOptions);
        // const ct = await table.getRecord(Service.entity.entityId)
        // setContact(ct)
    }, [])

    // React.useEffect(() => {
    //     const fn = async () => {
    //         try {
    //             const ct = await table.getRecord(Service.entity.entityId)
    //             if (ct != null) {
    //                 setContact(ct);
    //             } else {
    //                 setError("error")
    //             }
    //         } catch (error: any) {
    //             setError(error.message);
    //         }
    //     }
    //     fn();

    // }, [])

    return (
        <Grid>
            <GridRow rowGap colGap>
                <GridCell md={3} className={classNames.snapshot}>
                    <ContactView contact={contact} error={error} setError={setError} onEdit={onEdit} />
                </GridCell>
                <GridCell md={9} className={classNames.right}>
                    <GridRow rowGap>
                        {contact && contact.mictslos_contacttype[0].key == ContactType.Individual && (
                            <GridCell md={12}>
                                <LifeEvents />
                            </GridCell>
                        )}
                        <GridCell md={12}>
                            <FinancialHolding />
                        </GridCell>
                    </GridRow>
                </GridCell>
            </GridRow>
        </Grid>
    )
}