import * as React from "react"
import { Stack, StackItem } from "@fluentui/react/lib/Stack"
import { GridCell, GridRow, Panel, PanelContent, PanelHeader, PanelHeaderTitle, useBoolean } from "pcf-components"
import { IIconProps } from "@fluentui/react/lib/Icon"
import { ContactFinancialHoldings } from "../../common/model"
import cmstyles from "../common.style"
import { IContextualMenuItem } from "@fluentui/react/lib/ContextualMenu"
import { ICurrency } from "../../common/types"
import { Graph } from "./Graph"
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot"
import { Summary } from "./Summary"
import { Holding } from "./Holding"



const addIcon: IIconProps = { iconName: "Add"}
const cfh = new ContactFinancialHoldings()


export interface IFinancialHoldingProps {

}


export const FinancialHolding: React.FC<IFinancialHoldingProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDlgOpen, { setTrue: showDlg, setFalse: hideDlg }] = useBoolean(false)
    const fnHoldingCategory = React.useRef<IContextualMenuItem>()
    const [assetsPoints, liabilitiesPoints, assetsLiabilitiesPoints] = cfh.graphPoints()
    const [currency, setCurrency] = React.useState<ICurrency>({ code: '', symbol: ''})


    React.useEffect(() => {
        const fn = async () => {
            await cfh.load();
            // const c = await retrieveBaseCurrency();
            setCurrency({code: '$', symbol: 'dollar'})
            setIsLoading(false);
        }
        fn()
        // setCurrency({code: '$', symbol: 'dollar'})
    }, [])


    return (
        <Panel>
            <PanelHeader>
                <Stack horizontal horizontalAlign="space-between" className={cmstyles.fullWidth} >
                    <StackItem grow={1}>
                        <PanelHeaderTitle title={"Finanical holdings" + (currency.code ? `(${currency.code})` : "")} />
                    </StackItem>
                </Stack>
            </PanelHeader>
            <PanelContent>
                <GridRow rowGap>
                    <GridCell md={12}>
                        <Graph cfh={cfh} assetsPoints={assetsPoints} liabilitiesPoints={liabilitiesPoints} assetsLiabibilitiesPoints={assetsLiabilitiesPoints} />
                    </GridCell>
                    <GridCell md={12}>
                        <Pivot>
                            <PivotItem itemKey="" headerText="Summary">
                                <Summary cfh={cfh} assetsPoints={assetsPoints} liabilitiesPoints={liabilitiesPoints} />
                            </PivotItem>
                            {cfh.categories.map((category) => (
                                <PivotItem itemKey={'' + category.key} headerText={cfh.getCategoryName(category.key)}>
                                    <Holding holdings={cfh.getItems(category.key)} alias={cfh.getAlias(category.key)} />
                                </PivotItem>
                            ))}
                        </Pivot>
                    </GridCell>
                </GridRow>
            </PanelContent>
        </Panel>
    )
}