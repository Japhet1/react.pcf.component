import { ListView } from "pcf-components"
import * as React from "react"
import { ContactFinancialHoldings } from "../../common/model"
import { IData } from "./types"
import classNames from "./style"
import { Icon } from "@fluentui/react/lib/Icon"
import { IColumn, SelectionMode } from "@fluentui/react/lib/DetailsList"
import { css } from "@fluentui/react/lib/Utilities"
import { log } from "console"


export interface ISummaryProps {
    cfh: ContactFinancialHoldings
    assetsPoints: any
    liabilitiesPoints: any
}


export const Summary: React.FC<ISummaryProps> = (props) => {
    const [data, setData] = React.useState<IData[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const { assetsPoints, liabilitiesPoints } = props

    const listColumns: IColumn[] = [
        {
            key: 'name',
            name: 'name',
            fieldName: 'name',
            minWidth: 150,
            maxWidth: 600,
            isResizable: true,
            className: classNames.cell,
            onRender: (item: any, index?: number, column?: IColumn) => {
                return <span className={classNames.iconContent}><Icon iconName={props.cfh.getIconName(item.key)} className={classNames.icon} />{item.name}</span>
            }
        },
        {
            key: 'value',
            name: 'value',
            fieldName: 'value',
            minWidth: 66,
            isResizable: true,
            className: css(classNames.cell,classNames.cellRight),
            onRender: (item: any, index?: number, column?: IColumn) => {
                return <span>{item.value}</span>
            }
        },
    ]

    // console.log(assetsPoints)
    // console.log(liabilitiesPoints)

    React.useEffect(() => {
        const fn = async () => {
            const dt = assetsPoints.map((pt) => {
                return {
                    key: pt.key,
                    name: pt.legend,
                    value: pt.data
                }
            })
            dt.push(...liabilitiesPoints.map((pt) => {
                return {
                    key: pt.key,
                    name: pt.legend,
                    value: pt.data
                }
            }))
            setData(dt)
            setIsLoading(false)
        }
        fn()
    }, [])

    return (
        <ListView
            columns={listColumns}
            items={data}
            selectionMode={SelectionMode.none}
            isHeaderVisible={false}
            loading={isLoading}
        />
    )
}