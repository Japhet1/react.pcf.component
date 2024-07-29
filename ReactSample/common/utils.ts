import { IChoice } from "pcf-core";
import { FinancialHoldingCategory } from "./types";

export const getLifeEventIconName = (category: IChoice) => {
    switch (category.key) {
        case 20://health
            return 'Hospital';
        case 30:
            return 'Education';
        case 40:
            return 'Work';
        default:
            return 'CubeShape'
    }
}

export const getEntityName = (category: FinancialHoldingCategory) => {
    switch (category) {
        case FinancialHoldingCategory.Investments:
            return 'mictslos_fhinvestment';
        case FinancialHoldingCategory.Accounts:
            return 'mictslos_fhaccount';
        case FinancialHoldingCategory.Loans:
            return 'mictslos_fhloan';
        case FinancialHoldingCategory.LongTermSavings:
            return 'mictslos_fhlongtermsaving';
        case FinancialHoldingCategory.LinesOfCredit:
            return 'mictslos_fhlineofcredit';
    }
}

export const getIconName =(category: FinancialHoldingCategory) =>{
    switch (category) {
        case FinancialHoldingCategory.Accounts:
            return 'AccountBrowser';
        case FinancialHoldingCategory.LongTermSavings:
            return 'Savings';
        case FinancialHoldingCategory.Investments:
            return 'BarChartVertical';
        case FinancialHoldingCategory.Loans:
            return 'Money';
        case FinancialHoldingCategory.LinesOfCredit:
            return 'PaymentCard';
        default:
            return 'CubeShape'
    }
}

export const toNumber = (value: any) => {
    return +value || 0;
}