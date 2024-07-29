import * as React from 'react';
import { ListView } from 'pcf-components/lib/listview';
import { IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { IData } from './types';
import classNames from './style';
import { css } from '@fluentui/react/lib/Utilities';

export interface IHoldingProps {
    holdings: any[];
    alias:string
}

/**
 * A component that displays a list of financial holdings in a specific category.
 * @param props
 * @returns
 */
export const Holding: React.FC<IHoldingProps> = (props) => {
    const [data, setData] = React.useState<IData[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const listColumns: IColumn[] = [
        {
            key: 'name',
            name: '',
            fieldName: 'name',
            minWidth: 150,
            maxWidth: 600,
            isResizable: true,
            className: classNames.cell,
            onRender: (item: any, index?: number, column?: IColumn) => {
                return <span> {item.name}</span>
            }
        },
        {
            key: 'value',
            name: '',
            fieldName: 'value',
            minWidth: 66,
            isResizable: true,
            className: css(classNames.cell,classNames.cellRight),
            onRender: (item: any, index?: number, column?: IColumn) => {
                return <span>{item.value}</span>
            }
        },
        {
            key: 'empty',
            name: '',
            fieldName: 'value',
            minWidth: 15,
            maxWidth: 35,
            isResizable: true,
            className: classNames.cell,
            onRender: (item: any, index?: number, column?: IColumn) => {
                return <span></span>
            }
        }
    ];


    React.useEffect(() => {
        const dt = [];
        props.holdings.forEach((item) => {
            dt.push({
                name: item[`${props.alias}.mictslos_name`],
                value: item[`${props.alias}.mictslos_balance_base`]
            });
        });
        setData(dt);
        setIsLoading(false);
    }, []);

    return (
        <ListView
            columns={listColumns}
            items={data}
            loading={isLoading}
            isHeaderVisible={false}
            selectionMode={SelectionMode.none} />
    );
}