import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import * as React from 'react';
import { ContactFinancialHoldings } from '../../common/model';
import { DonutChart, IChartDataPoint } from '@fluentui/react-charting';
import { Text } from '@fluentui/react/lib/Text';
import { Localization } from 'pcf-core';
import { GridCell, GridRow } from 'pcf-components/lib/grid';

// Define CSS styles for the tile display
const classNames = mergeStyleSets({
    tile: {
        ":not(:last-child)": {
            borderRight: '1px solid rgb(243, 242, 241)'
        }
    },
    heading:{
        padding:'0 10px'
    }
});

const hasDataPoint = (data: IChartDataPoint[]) => data.some(d => d.data > 0);

export interface IGraphProps {
    cfh: ContactFinancialHoldings;
    assetsPoints: IChartDataPoint[]
    liabilitiesPoints: IChartDataPoint[]
    assetsLiabibilitiesPoints: IChartDataPoint[]
}

export const Graph: React.FC<IGraphProps> = (props) => {
    const { assetsPoints, liabilitiesPoints, assetsLiabibilitiesPoints } = props;

    return (<GridRow rowGap >
        {hasDataPoint(assetsLiabibilitiesPoints) && 
        <GridCell md={4} className={classNames.tile}>
            <div>
                <Text variant="medium">Total Assets / Total Liabilities</Text>
            </div>
            <DonutChart
                data={{
                    //chartTitle: Localization.getString('Total.assetsliabilities'),
                    chartData: assetsLiabibilitiesPoints,
                }}
                innerRadius={70}
                legendsOverflowText={'overflow Items'}
                enabledLegendsWrapLines
                hideLegend={false}
                hideLabels={false}
                styles={{ root: { pointerEvents: "none" } }}
                culture={window.navigator.language}
            />
        </GridCell>
        }
        {hasDataPoint(assetsPoints) && <GridCell md={4} className={classNames.tile}>
            <div className={classNames.heading}>
                <Text variant="medium">Total assets</Text>
            </div>
            <DonutChart
                data={{
                    //chartTitle: Localization.getString('Total.assets'),
                    chartData: assetsPoints,
                }}
                innerRadius={70}
                enabledLegendsWrapLines={true}
                hideLegend={false}
                valueInsideDonut={assetsPoints.reduce((accu, cur) => accu + cur.data, 0)}
                hideLabels={false}
                showLabelsInPercent={true}
                styles={{ root: { pointerEvents: "none" } }}
                culture={window.navigator.language}
                legendProps={{
                    enabledWrapLines: true,
                }}
            />
        </GridCell>}
        {hasDataPoint(liabilitiesPoints) && <GridCell md={4} className={classNames.tile}>
            <div className={classNames.heading}>
                <Text variant="medium">Total liabilities</Text>
            </div>
            <DonutChart
                data={{
                    //chartTitle: Localization.getString('Total.liabilities'),
                    chartData: liabilitiesPoints,
                }}
                innerRadius={70}
                legendsOverflowText={'overflow Items'}
                enabledLegendsWrapLines
                hideLegend={false}
                valueInsideDonut={liabilitiesPoints.reduce((accu, cur) => accu + cur.data, 0)}
                hideLabels={false}
                showLabelsInPercent={true}
                styles={{ root: { pointerEvents: "none" } }}
                culture={window.navigator.language}
                legendProps={{
                    enabledWrapLines: true,
                }}
            />
        </GridCell>}
    </GridRow>);
}