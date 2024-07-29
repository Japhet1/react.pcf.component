import * as React from 'react';
import { LifeEvent } from '../common/model';
import { IChoice } from 'pcf-core';
import { UseArrayAction } from 'pcf-components/lib/hooks';
import { dummyLifeEventDataProp } from '../components/lifeEvent/LifeEvents';

export interface LifeEventContextProviderProps {
    items: dummyLifeEventDataProp[];
    dispatch: (action: UseArrayAction<LifeEvent>) => void
    categories: IChoice[]
}

export interface ILifeEventContext extends LifeEventContextProviderProps{
}

export const LifeEventContext = React.createContext<ILifeEventContext>(null)

export const LifeEventContextProvider: React.FC<LifeEventContextProviderProps> = (props) => {
    return <LifeEventContext.Provider value={{ items:props.items, dispatch:props.dispatch, categories: props.categories }}>
        {props.children}
    </LifeEventContext.Provider>
}
