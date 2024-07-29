import { mergeStyleSets } from '@fluentui/merge-styles';

const classNames = mergeStyleSets({
  mt8: {
    marginTop: '8px !important',
  },
  mt15: {
    marginTop: '15px !important',
  },
  mb8: {
    marginBottom: '8px !important',
  },
  ml8: {
    marginLeft: '8px !important',
  },
  padding16: {
    padding: '16px !important',
  },
  bold: {
    fontWeight: 600
  },
  cmdButton: {
    height: '100%',
    marginRight: 10
  },
  fullWidth: {
    width: '100%'
  },
  width50: {
    width: '50%'
  },
  formikForm: {
    selectors: {
      "label": {
        marginBottom: "8px !important"
      }
    }
  },
  invisibleElement: {
    width: 1,
    overflow: "hidden"
  }
});

export default classNames;
