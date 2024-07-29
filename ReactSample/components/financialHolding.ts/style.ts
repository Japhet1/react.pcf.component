import { mergeStyleSets } from '@fluentui/react/lib/Styling';

const classNames = mergeStyleSets({
    cell: {
      padding: "14px 12px !important",
    },
    cellRight:{
        textAlign:"right"
    },
    iconContent:{
        display: "inline-flex",
        alignItems: "center"
    },
    icon:{
      paddingRight: 3
    }
})

export default classNames;