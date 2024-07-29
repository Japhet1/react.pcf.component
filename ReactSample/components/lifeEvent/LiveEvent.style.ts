import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from '@fluentui/react/lib/Styling';
const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: 'border-box',
      display: 'flex',
      background: palette.white,
      marginBottom: 10,
      marginTop: 10,
      boxShadow: "rgba(0, 0, 0, 0.1) 0px 0.3px 0.9px, rgba(0, 0, 0, 0.13) 0px 1.6px 3.6px",
      // selectors: {
      //   '&:hover': { background: palette.neutralLight },
      // },
    },
  ],
  itemContent: {
    overflow: 'hidden',
    flexGrow: 1,
  },
  itemName: {
    fontWeight: 600
  },
  itemIndex: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 10,
    flexShrink: 0,
  }
});

export default classNames;