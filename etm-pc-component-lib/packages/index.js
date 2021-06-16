import EtmTitle from './EtmTitle/src/EtmTitle'
import EtmButtonGroup from './EtmButtonGroup/src/EtmButtonGroup'
// new
import EtmAppBar from './EtmAppBar/src/EtmAppBar'
import EtmTabs from './EtmTabs/src/EtmTabs'
import EtmToolBar from './EtmToolBar/src/EtmToolBar'
import EtmTablePage from './EtmTablePage/src/EtmTablePage'
import EtmTableToolBar from './EtmTableToolBar/src/EtmTableToolBar'
import EtmLayout from './EtmLayout/src/EtmLayout'
import EtmToolPanel from './EtmToolPanel/src/EtmToolPanel'
import EtmText from './EtmText/src/EtmText'
import EtmStatus from './EtmStatus/src/EtmStatus'
import EtmForm from './EtmForm/src/EtmForm'
import EtmFormFoot from './EtmFormFoot/src/EtmFormFoot'
import EtmTable from './EtmTable/src/EtmTable'
import EtmLayoutSplit from '~/EtmLayoutSplit/src/EtmLayoutSplit'
import EtmEmpty from '~/EtmEmpty/src/EtmEmpty'
import EtmScreenTab from '~/EtmScreenTab/src/EtmScreenTab'
import EtmSide from './EtmSide/src/EtmSide'
import EtmPop from './EtmPop/src/EtmPop'
import EtmTip from './EtmTip/src/EtmTip'
import EtmMainBody from './EtmMainBody/src/EtmMainBody'
import EtmUploadAvatar from './EtmUploadAvatar/src/EtmUploadAvatar'
import EtmTableDigit from './EtmTableDigit/src/EtmTableDigit'

import etmQuick from './EtmTip/src/etmQuick'
import EtmDrawer from '~/EtmDrawer/src/EtmDrawer'
import EtmFieldLabel from '~/EtmFieldLabel/src/EtmFieldLabel'
import EtmStaticDialog from '~/EtmStaticDialog/src/EtmStaticDialog'
import EtmFontIcon from '~/EtmFontIcon/src/EtmFontIcon'
const components = [
  EtmTitle, EtmButtonGroup,
  // new
  EtmAppBar, EtmTabs, EtmToolBar, EtmTablePage, EtmTableToolBar, EtmLayout, EtmToolPanel, EtmText, EtmStatus, EtmForm, EtmFormFoot, EtmTable, EtmLayoutSplit, EtmEmpty, EtmScreenTab, EtmSide, EtmPop, EtmTip, EtmMainBody, EtmDrawer, EtmFieldLabel, EtmStaticDialog, EtmUploadAvatar, EtmFontIcon, EtmTableDigit
]

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.use(etmQuick)

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  EtmTitle,
  EtmButtonGroup,
  // new
  EtmAppBar,
  EtmTabs,
  EtmToolBar,
  EtmTablePage,
  EtmTableToolBar,
  EtmLayout,
  EtmToolPanel,
  EtmText,
  EtmStatus,
  EtmForm,
  EtmFormFoot,
  EtmLayoutSplit,
  EtmEmpty,
  EtmScreenTab,
  EtmSide,
  EtmPop,
  EtmTip,
  EtmMainBody,
  EtmDrawer,
  EtmFieldLabel,
  EtmStaticDialog,
  EtmUploadAvatar,
  EtmFontIcon,
  EtmTableDigit
}
