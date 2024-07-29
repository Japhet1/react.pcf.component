import { ChoiceProperty, EntityRecord, IChoice, ILookUp, Localization, LookUpProperty, NumberProperty, Property, ReadOnlyProperty, Service, Table, getOptionSet } from 'pcf-core';
import { AccountClassification, FinancialHoldingCategory, FinancialHoldingRole } from './types';
import { groupBy, uniqBy } from 'lodash-es';
import { LinkType, attributes, choiceColumn, fetchxml, filterAnd, linkEntitySimple, lookupColumn } from 'fetchxml4js';
import { getTheme } from '@fluentui/react/lib/Styling';
import * as Yup from 'yup';
import { getIconName, toNumber } from './utils';

const theme = getTheme()

export class Contact extends EntityRecord {

    public readonly fullname: string = undefined;

    public mictslos_id: string = undefined;

    public emailaddress1: string = undefined;

    public address1_telephone1: string = undefined;

    public address1_city: string = undefined;

    public address1_country: string = undefined;

    public address1_line1: string = undefined;

    public address1_line2: string = undefined;

    public annualincome_base: string = undefined;

    public jobtitle: string = undefined;

    public mictslos_branch: ILookUp = undefined;

    public mictslos_bank: ILookUp = undefined;

    public gendercode: IChoice = undefined;

    public mictslos_category: IChoice = undefined;

    public mictslos_contacttype: IChoice = undefined;

    public birthdate: string = undefined;

    public mictslos_employersname: string = undefined;

    public mictslos_bizoperation: IChoice = undefined;

    public mictslos_bizplaceofincorporation: string = undefined;

    public mictslos_bizregistrationnumber: string = undefined;

    public mictslos_bizyears: number = undefined;

    public mictslos_joindate: string = undefined;

    public preferredcontactmethodcode: IChoice = undefined;

    getIdColumnName(): string {
        return 'contactid'
    }

}


export class ContactTable extends Table<Contact> {
    constructor() {
        super("Contact", "contact", "contactid", Contact)
    }
}


export class LifeEvent extends EntityRecord {

    
    public mictslos_name: string = undefined;
    
    public mictslos_contact: ILookUp = undefined;
   
    public mictslos_eventdate: string = undefined;
    
    public mictslos_category: IChoice = undefined;
    
    public mictslos_eventtype: IChoice = undefined;
    
    public mictslos_detail: string = undefined;

    getIdColumnName(): string {
        return "mictslos_lifeeventid"
    }

    validate(data?: any) {
        return Yup.object().shape({
            mictslos_eventdate: Yup.string().required('Required').nullable(),
            mictslos_eventtype: Yup.object({
                key: Yup.number().required('Required'),
            }).required('Required').nullable(),
            mictslos_category: Yup.object({
                key: Yup.number().required('Required'),
            }).required('Required').nullable(),
        });
    }

}


export class LifeEventTable extends Table<LifeEvent>{
    constructor() {
        super("Life Event", "mictslos_lifeevent", "mictslos_lifeeventid", LifeEvent);
    }
}

// Define some static dummy data
const staticHoldings = [
    {
        "FH.mictslos_financialholdingcategory": "Investments",
        "FH.mictslos_accountingclassification": "Asset",
        "FH_ACCOUNT.mictslos_balance_base": 0,
        "FH_INVESTMENT.mictslos_balance_base": 2000,
        "FH_LTSAVINGS.mictslos_balance_base": 0,
        "FH_LOAN.mictslos_balance_base": 0,
        "FH_LOC.mictslos_balance_base": 0,
    },
    {
        "FH.mictslos_financialholdingcategory": "Long Term Savings",
        "FH.mictslos_accountingclassification": "Asset",
        "FH_ACCOUNT.mictslos_balance_base": 0,
        "FH_INVESTMENT.mictslos_balance_base": 0,
        "FH_LTSAVINGS.mictslos_balance_base": 4000,
        "FH_LOAN.mictslos_balance_base": 0,
        "FH_LOC.mictslos_balance_base": 0,
    },
    {
        "FH.mictslos_financialholdingcategory": "Accounts",
        "FH.mictslos_accountingclassification": "Asset",
        "FH_ACCOUNT.mictslos_balance_base": 5000,
        "FH_INVESTMENT.mictslos_balance_base": 0,
        "FH_LTSAVINGS.mictslos_balance_base": 0,
        "FH_LOAN.mictslos_balance_base": 0,
        "FH_LOC.mictslos_balance_base": 0,
    },
    {
        "FH.mictslos_financialholdingcategory": "Lines Of Credit",
        "FH.mictslos_accountingclassification": "Liability",
        "FH_ACCOUNT.mictslos_balance_base": 0,
        "FH_INVESTMENT.mictslos_balance_base": 0,
        "FH_LTSAVINGS.mictslos_balance_base": 0,
        "FH_LOAN.mictslos_balance_base": 0,
        "FH_LOC.mictslos_balance_base": 1000,
    },
    {
        "FH.mictslos_financialholdingcategory": "Loans",
        "FH.mictslos_accountingclassification": "Liability",
        "FH_ACCOUNT.mictslos_balance_base": 0,
        "FH_INVESTMENT.mictslos_balance_base": 0,
        "FH_LTSAVINGS.mictslos_balance_base": 0,
        "FH_LOAN.mictslos_balance_base": 3000,
        "FH_LOC.mictslos_balance_base": 0,
    }
    
];

const staticCategories = [
    { key: 1, text: "Accounts" },
    { key: 2, text: "Investments" },
    { key: 3, text: "Loans" },
    { key: 4, text: "Long Term Savings" },
    { key: 5, text: "Lines Of Credit" }
];

// Modify the class
export class ContactFinancialHoldings {
    // Array to store financial holdings data
    public holdings: any[] = [];
    public categories: { key: number, text: string }[] = [];

    // Method to load static data
    public async load() {
        // Replace API call with static data assignment
        this.holdings = staticHoldings;

        // Assign static categories
        this.categories = staticCategories;
    }

    // Method to get alias based on financial holding category
    public getAlias(category: FinancialHoldingCategory) {
        switch (category) {
            case FinancialHoldingCategory.Accounts:
                return 'FH_ACCOUNT';
            case FinancialHoldingCategory.LongTermSavings:
                return 'FH_LTS';
            case FinancialHoldingCategory.Investments:
                return 'FH_INV';
            case FinancialHoldingCategory.Loans:
                return 'FH_LOAN';
            case FinancialHoldingCategory.LinesOfCredit:
                return 'FH_LOC';
            default:
                return '';
        }
    }

    // Method to get icon name based on financial holding category
    public getIconName(category: FinancialHoldingCategory) {
        return getIconName(category);
    }

    // Method to get unique items based on financial holding category
    public getItems(category: FinancialHoldingCategory): any[] {
        return uniqBy(this.holdings, (hld) => {
            return hld["FH.mictslos_financialholdingcategory"] === category;
        });
    }

    // Method to get category name based on financial holding category
    public getCategoryName(category: FinancialHoldingCategory) {
        return this.categories.find((ct) => ct.key === category)!.text;
    }

    // Method to organize and calculate graph points for assets and liabilities
    public graphPoints() {
        const assetsColor = [theme.palette.blue, theme.palette.blueDark, theme.palette.blueMid];
        const liabilitiesColor = [theme.palette.neutralLight, theme.palette.neutralTertiary, theme.palette.neutralSecondary];

        // Group financial holdings into assets and liabilities
        const grouped = groupBy(this.holdings, (item) => {
            if (item["FH.mictslos_accountingclassification"] === "Asset") {
                return "assets";
            }
            return "liabilities";
        });

        // Group assets and liabilities based on financial holding category
        const assets = grouped.assets ? groupBy(grouped.assets, (item) => {
            return item["FH.mictslos_financialholdingcategory"];
        }) : [];
        const liabilities = grouped.liabilities ? groupBy(grouped.liabilities, (item) => {
            return item["FH.mictslos_financialholdingcategory"];
        }) : [];

        // Calculate data points for assets
        const assetsPoints = Object.keys(assets).map((key, index) => {
            return {
                legend: key,
                data: assets[key].reduce((accu, cur) => {
                    return accu + (toNumber(cur["FH_ACCOUNT.mictslos_balance_base"]) || toNumber(cur["FH_INVESTMENT.mictslos_balance_base"]) || toNumber(cur["FH_LTSAVINGS.mictslos_balance_base"]));
                }, 0),
                color: assetsColor[index % assetsColor.length],
                key: assets[key][0]["FH.mictslos_financialholdingcategory"]
            };
        });
        const liabilitiesPoints = Object.keys(liabilities).map((key, index) => {
            return {
                legend: key,
                data: liabilities[key].reduce((accu, cur) => {
                    return accu + (toNumber(cur["FH_LOAN.mictslos_balance_base"]) || toNumber(cur["FH_LOC.mictslos_balance_base"]));
                }, 0),
                color: liabilitiesColor[index % liabilitiesColor.length],
                key: liabilities[key][0]["FH.mictslos_financialholdingcategory"]
            };
        });

        // Calculate total assets and liabilities
        const totalAssets = assetsPoints.reduce((accu, cur) => {
            return accu + cur.data;
        }, 0);
        const totalLiabilities = liabilitiesPoints.reduce((accu, cur) => {
            return accu + cur.data;
        }, 0);

        return [assetsPoints, liabilitiesPoints, [{ legend: "Assets", data: totalAssets, color: assetsColor[0] }, { legend: "Liabilities", data: totalLiabilities, color: liabilitiesColor[0] }]];
    }
}
