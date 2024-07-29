import * as React from 'react'
import { CommandBarButton, mergeStyleSets, Stack, StackItem } from "@fluentui/react"
import { IIconProps } from "@fluentui/react/lib/Icon"
import { Panel, PanelContent, PanelHeader, PanelHeaderTitle } from "pcf-components/lib/panel"
import cmstyles from '../common.style'
import { LifeEventContextProvider } from '../../contextProviders/lifeEventContext'
import { Loading } from 'pcf-components/lib/loading/Loading'
import { useArray, useBoolean } from 'pcf-components'
import { LifeEvent, LifeEventTable } from '../../common/model';
import { IChoice, Service } from 'pcf-core'
import { LifeEventTile } from './LifeEventTile'
import { LifeEventForm } from './LifeEventForm'

const addIcon: IIconProps = { iconName: 'Add'}

export interface dummyLifeEventDataProp {
    mictslos_name: string;
    mictslos_contact: string;
    mictslos_eventdate: string;
    mictslos_category: string;
    mictslos_eventtype: string[];
    mictslos_detail: string;
}


// const dummyLifeEventData: dummyLifeEventDataProp = [
//     {
//         "mictslos_name": "",
//         "mictslos_contact": "",
//         "mictslos_eventdate": "7/24/2024",
//         "mictslos_category": "Education",
//         "mictslos_eventtype": ["Associate", "Bachelor", "Doctorate"],
//         "mictslos_detail": ""
//     },
//     {
//         "mictslos_name": "",
//         "mictslos_contact": "",
//         "mictslos_eventdate": "7/24/2024",
//         "mictslos_category": "Employment",
//         "mictslos_eventtype": ["Business closed", "Business start"],
//         "mictslos_detail": ""
//     },
//     {
//         "mictslos_name": "",
//         "mictslos_contact": "",
//         "mictslos_eventdate": "7/24/2024",
//         "mictslos_category": "Health",
//         "mictslos_eventtype": ["Hospital", "Serious illness"],
//         "mictslos_detail": ""
//     }
// ]


const classNames = mergeStyleSets({
    tiles: {
        display: "grid",
        columnGap: 12,
        rowGap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, ifr))"
    }
})

export interface IlifeEventsProps {}

export const LifeEvents: React.FC<IlifeEventsProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [items, dispatch] = useArray<LifeEvent>([], (a, b) => a.Id == b.Id)
    const [isDlgOpen, { setTrue: showDlg, setFalse: hideDlg }] = useBoolean(false)

    const [item, setItem] = React.useState([
        {
            "mictslos_name": "",
            "mictslos_contact": "",
            "mictslos_eventdate": "7/24/2024",
            "mictslos_category": "Education",
            "mictslos_eventtype": ["Associate", "Bachelor", "Doctorate"],
            "mictslos_detail": ""
        },
        {
            "mictslos_name": "",
            "mictslos_contact": "",
            "mictslos_eventdate": "7/24/2024",
            "mictslos_category": "Employment",
            "mictslos_eventtype": ["Business closed", "Business start"],
            "mictslos_detail": ""
        },
        {
            "mictslos_name": "",
            "mictslos_contact": "",
            "mictslos_eventdate": "7/24/2024",
            "mictslos_category": "Health",
            "mictslos_eventtype": ["Hospital", "Serious illness"],
            "mictslos_detail": ""
        }
    ])

    const optionset = React.useRef<IChoice[]>([
        {
            "key": 1,
            "text": "Education",
        },
        {
            "key": 2,
            "text": "Employment",
        },
        {
            "key": 3,
            "text": "Health",
        },
    ])
    const lifeEvent = React.useRef<LifeEvent>()
    const contactFullName = React.useRef("")
    const table = new LifeEventTable()

    const onAddEvent = React.useCallback((category: IChoice) => {
        lifeEvent.current = new LifeEvent()

        lifeEvent.current.mictslos_category = category
        lifeEvent.current.mictslos_contact = {
            id: Service.entity.entityId,
            entityLogicalName: Service.entity.entityTypeName
        }
        showDlg()
    }, [])


    const onAddEvent2 = React.useCallback(() => {
        lifeEvent.current = new LifeEvent()

        lifeEvent.current.mictslos_contact = {
            id: Service.entity.entityId,
            entityLogicalName: Service.entity.entityTypeName
        }
        showDlg()
    }, [])

    const onEdit = React.useCallback((event: LifeEvent) => {
        lifeEvent.current = event
        showDlg()
    }, [])

    const onAfterSave = React.useCallback((event: LifeEvent, updating: boolean) => {
        if (updating) {
            dispatch({ type: 'replace', data: event })
        } else {
            dispatch({ type: 'add', data: event})
        }
        hideDlg()
    }, [])

    const getEvents = (category: IChoice) => {
        return items.filter((evt) => evt.mictslos_category.key == category.key)
    }

    React.useEffect(() => {

    })



    return (
        <Panel>
            <PanelHeader>
                <Stack horizontal horizontalAlign='space-between' className={cmstyles.fullWidth}> 
                    <StackItem grow={1}>
                        <PanelHeaderTitle title='Life events'/>
                    </StackItem>
                    <StackItem>
                        <CommandBarButton iconProps={addIcon} text='Add event' onClick={onAddEvent2} className={cmstyles.cmdButton} />
                    </StackItem>
                </Stack>
            </PanelHeader>
            <PanelContent>
                {/* <Loading text='Working on it...' isLoading={isLoading} > */}
                    <LifeEventContextProvider items={item} categories={optionset.current} dispatch={dispatch} > 
                        <div className={classNames.tiles}>
                            {optionset.current.map(category => (
                                <LifeEventTile
                                    category={category}
                                    events={getEvents(category)}
                                    onAddEvent={onAddEvent}
                                    key={category.key}
                                    onEdit={onEdit}
                                />
                            ))}
                        </div>
                        {isDlgOpen && <LifeEventForm event={lifeEvent.current} onCancel={hideDlg} onAfterSave={onAfterSave} contactFullname={contactFullName.current} />}
                    </LifeEventContextProvider>
                {/* </Loading> */}
            </PanelContent>
        </Panel>
    )
}