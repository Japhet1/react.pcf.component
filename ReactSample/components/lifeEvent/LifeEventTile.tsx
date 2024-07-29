import { IChoice, Localization } from 'pcf-core';
import * as React from 'react';
import { LifeEvent } from '../../common/model';
import { Panel, PanelContent, PanelHeaderFlexible } from 'pcf-components/lib/panel';
import { Stack, StackItem } from '@fluentui/react/lib/Stack';
import { ActionButton, IButtonStyles, IconButton } from '@fluentui/react/lib/Button';
import { getLifeEventIconName } from '../../common/utils';
import styles from '../common.style';
import humanReadableDate from '../../common/humanReadableDate';
import { LifeEventList } from './ListEventList';
import { LifeEventContext } from '../../contextProviders/lifeEventContext';
import { getTheme } from '@fluentui/react/lib/Styling';
import { Text } from '@fluentui/react/lib/Text';
import { useBoolean } from 'pcf-components/lib/hooks';


// Get Fluent UI theme
const theme = getTheme();

// Define button styles
const iconBtnPrimaryStyles = {
    root: {
        width: 36,
        height: 36,
        background: theme.semanticColors.primaryButtonBackground,
        pointerEvents: "none"
    },
    icon: {
        color: theme.semanticColors.primaryButtonText
    }
} as Partial<IButtonStyles>;

const iconBtnStyles = {
    root: {
        width: 36,
        height: 36,
        border: `2px solid ${theme.semanticColors.primaryButtonBackground}`,
        pointerEvents: "none"
    }
} as Partial<IButtonStyles>;

const btnStyle = {
    root: {
        marginTop: 17,
        marginLeft: "auto",
        height: "auto",
        fontSize: theme.fonts.smallPlus.fontSize
    },
    icon: {
        fontSize: theme.fonts.smallPlus.fontSize
    }
} as Partial<IButtonStyles>;

const iconAdd = { iconName: 'Add' };

const gap12 = { childrenGap: 12 };

// Define props interface for LifeEventTile component
export interface ILifeEventTileProps {
    category: IChoice;
    events: LifeEvent[];
    onAddEvent: (category: IChoice) => void;
    onEdit: (event: LifeEvent) => void;
}

/**
 * A component that displays a single life event category tile.
 * You can click on the tile to view the list of events in the category.
 * @param props
 */
export const LifeEventTile: React.FC<ILifeEventTileProps> = (props) => {
    // State hook for dialog visibility
    const [isDlgOpen, { setTrue: showDlg, setFalse: hideDlg }] = useBoolean(false);

    // Access LifeEventContext
    const context = React.useContext(LifeEventContext);

    // Count of events in the category
    const count = props.events.length;

    // Callback to handle event deletion
    const onDelete = React.useCallback((event: LifeEvent) => {
        context.dispatch({ type: 'remove', data: event });
    }, []);

    // Callback to handle adding a new event
    const onAdd = React.useCallback((event?: React.MouseEvent<HTMLAnchorElement>) => {
        event!.stopPropagation()
        props.onAddEvent(props.category);
    }, []);

    // JSX content based on event count
    const content = count > 0 ? (
        <Stack tokens={{ childrenGap: 6 }}>
            <StackItem><Text variant='smallPlus' className={styles.bold}>{props.events[0].mictslos_eventtype.text}</Text></StackItem>
            <StackItem><Text variant='smallPlus'>{humanReadableDate(new Date(props.events[0].mictslos_eventdate))}</Text></StackItem>
        </Stack>
    ) : (
        <ActionButton iconProps={iconAdd} onClick={onAdd} styles={btnStyle}>
            Add event
        </ActionButton>
    );

    // Render the LifeEventTile component
    return (<Panel onClick={showDlg}>
        <PanelHeaderFlexible>
            <Stack horizontal tokens={gap12}>
                <IconButton iconProps={{ iconName: getLifeEventIconName(props.category) }} styles={props.category.key == 1 ? iconBtnStyles : iconBtnPrimaryStyles}></IconButton>
                <StackItem>
                    <Stack>
                        <StackItem>
                            <span className={styles.bold}>{props.category.text}</span>
                        </StackItem>
                        <StackItem>
                            <Text variant='smallPlus'>{count} event</Text>
                        </StackItem>
                    </Stack>
                </StackItem>
            </Stack>
        </PanelHeaderFlexible>
        <PanelContent>
            {content}
            {isDlgOpen && <div className={styles.invisibleElement}><LifeEventList events={props.events} header={props.category.text} onCancel={hideDlg} onDelete={onDelete} onAdd={onAdd} onEdit={props.onEdit} /></div>}
        </PanelContent>
    </Panel>
    );
};
