import * as React from 'react';
import { LifeEvent, LifeEventTable } from '../../common/model';
import { ContextMenuRenderer, IContexMenuCommandExecuteParameters } from 'pcf-components/lib/fieldrenderers';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import classNames from './LiveEvent.style';
import { Localization, Service, getUserDateFormatForDateFNS } from 'pcf-core';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { PanelStyles } from '../../common/style';
import { Loading } from 'pcf-components/lib/loading/Loading';
import { List } from '@fluentui/react/lib/List';
import { ConfirmDialog } from 'pcf-components/lib/dialogs';
import { ITheme, getTheme } from '@fluentui/react/lib/Styling';
import format from 'date-fns/format';
import { Stack, StackItem } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { useAsync, useBoolean } from 'pcf-components/lib/hooks';

const theme: ITheme = getTheme();

const panelStyle = Object.assign({}, PanelStyles, {
    content: {
        backgroundColor: theme.palette.neutralLighter,
        paddingTop: 10
    }
});
const emptyPanel = Object.assign({}, PanelStyles, {
    content: {
        display: "flex",
        flex: "1 1 0%"
    },
    scrollableContent: {
        display: "flex"
    }
});
const stackStyle = {
    root: {
        textAlign: "center",
        height: "100%",
        marginTop: "auto",
        marginBottom: "auto"
    }
}

// Define props interface for LifeEventList component
export interface ILifeEventListProps {
    events: LifeEvent[];
    header: string;
    onCancel: () => void;
    onDelete: (event: LifeEvent) => void;
    onAdd: () => void;
    onEdit: (event: LifeEvent) => void;
}
// Define the LifeEventList functional component
export const LifeEventList: React.FC<ILifeEventListProps> = (props) => {
    // State hooks for delete dialog visibility and selected item
    const [isDeleteDlgOpen, { setTrue: showDelDlg, setFalse: hideDelDlg }] = useBoolean(false);
    const selectedItem = React.useRef<LifeEvent>(null);

    // LifeEventTable instance
    const list = new LifeEventTable();

    // Context menu items
    const menuItems = React.useMemo(() => [
        { key: 'edit', text: Localization.getString('edit') },
        { key: 'delete', text: Localization.getString('delete') },
    ], []);

    // Async hook for delete operation
    const [onDeleteHandler, pending, error] = useAsync(async () => {
        if (selectedItem.current) {
            await list.deleteRecord(selectedItem.current);
            props.onDelete(selectedItem.current);
            hideDelDlg();
            // selectedItem.current = null;
            return 'Item Deleted';
        }
        // Service.notification.close(pid);
    });

    // Callback for context menu item execution
    const onContextMenuItemExecute = (event: IContexMenuCommandExecuteParameters<LifeEvent>) => {
        selectedItem.current = event.item;
        switch (event.key) {
            case 'edit':
                props.onEdit(selectedItem.current);
                break;
            case 'delete':
                showDelDlg();
                break;
        }
    };
    // Callback to render footer content
    const onRenderFooterContent = React.useCallback(() => (
        <div>
            <PrimaryButton onClick={props.onAdd}>Add event</PrimaryButton>
        </div>
    ), [props.onAdd]);

    // Callback to render each cell in the list
    const onRenderCell = (item: LifeEvent, index?: number): React.ReactNode => {
        return (
            <div className={classNames.itemCell} data-is-focusable={true} key={item.Id}>
                <div className={classNames.itemContent}>
                    <div className={classNames.itemName}>{item.mictslos_eventtype!.text}</div>
                    <div>{format(new Date(item.mictslos_eventdate), getUserDateFormatForDateFNS())}</div>
                    <div className={classNames.itemIndex}>{item.mictslos_detail}</div>
                </div>
                <ContextMenuRenderer className={classNames.chevron} menuItems={menuItems} onExecute={onContextMenuItemExecute} item={item} key={item?.Id} />
            </div>
        );
    };

    // Render the LifeEventList component
    return (<Panel
        isOpen={true}
        onDismiss={() => props.onCancel()}
        type={PanelType.smallFixedFar}
        closeButtonAriaLabel="Close"
        isFooterAtBottom={true}
        headerText={props.header}
        styles={props.events.length > 0 ? panelStyle : emptyPanel}
        onRenderFooterContent={onRenderFooterContent}
    >
        <>
            {props.events.length > 0 && <List items={props.events} onRenderCell={onRenderCell} />}
            {props.events.length == 0 && <Stack verticalAlign='center' styles={stackStyle} tokens={{ childrenGap: 15 }}>
                <StackItem>
                    <Text variant="xLarge">Add life event to this category</Text>
                </StackItem>
                <StackItem>
                    <PrimaryButton onClick={props.onAdd}>Add event</PrimaryButton>
                </StackItem>
            </Stack>}
        </>
        {isDeleteDlgOpen && selectedItem.current && <ConfirmDialog title={Localization.getString('Delete.label')} subText={Localization.getString('Delete.warning')} onAction={onDeleteHandler} onCancel={hideDelDlg} />}
    </Panel>
    );
};
