import { FontIcon } from "@fluentui/react/lib/Icon";
import { Stack, StackItem } from '@fluentui/react/lib/Stack';
import * as React from "react";
import { mergeStyleSets } from "@fluentui/merge-styles";

const classNames = mergeStyleSets ({
    columnView: {},
    label: {
        selectors: {
            '> :not(:first-child)' : {
                marginLeft: 8
            },
            '> i' : {
                alignItems: "center",
                display: "flex"
            },
            '> span' : {
                fontWeight: 400,
                color: "rgb(96, 94, 92)",
                fontSize: 12
            }
        }
    },
    value: {
        marginTop: "4px !important"
    }
});

export interface IColumnViewProps {
    label: string;
    iconName?: string;
    value: string | React.ReactNode
}

export const ColumnView: React.FC<IColumnViewProps> = (props) => {

    return (
        <Stack className={classNames.columnView}>
            <Stack className={classNames.label} horizontal verticalAlign="center">
                {props.iconName && <FontIcon iconName={props.iconName} />}
                <span>{props.label}</span>
            </Stack>
            <StackItem className={classNames.value}>
                {props.value}
            </StackItem>
        </Stack>
    )
}