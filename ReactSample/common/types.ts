

export enum Gender{
    Male = 1,
    Female = 2
}

export enum FinancialHoldingCategory{
    Accounts = 1,
    Investments = 2,
    Loans = 3,
    LongTermSavings = 4,
    LinesOfCredit = 5
}

export enum ContactType{
    Individual = 1,
    Company = 2
}

export enum AccountClassification{
    Asset = 1,
    Liability = 2
}

export enum FinancialHoldingRole{
    Owner = 1
}

export interface ICurrency {
    code: string;
    symbol: string
}

export const PUBLISHER_PREFIX = 'mictslos_';