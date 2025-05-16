import './assets/main.css'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { themeConfig } from './themes'
import 'primeicons/primeicons.css'
import ToastPlugin from 'vue-toast-notification'
import AutoComplete from 'primevue/autocomplete'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import AnimateOnScroll from 'primevue/animateonscroll'
import Avatar from 'primevue/avatar'
import AvatarGroup from 'primevue/avatargroup'
import Badge from 'primevue/badge'
import BadgeDirective from 'primevue/badgedirective'
import BlockUI from 'primevue/blockui'
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import Breadcrumb from 'primevue/breadcrumb'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import CascadeSelect from 'primevue/cascadeselect'
import Checkbox from 'primevue/checkbox'
import Chip from 'primevue/chip'
import Chips from 'primevue/chips'
import ColorPicker from 'primevue/colorpicker'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmPopup from 'primevue/confirmpopup'
import ConfirmationService from 'primevue/confirmationservice'
import ContextMenu from 'primevue/contextmenu'
import DataTable from 'primevue/datatable'
import DataView from 'primevue/dataview'
import DeferredContent from 'primevue/deferredcontent'
import Dialog from 'primevue/dialog'
import DialogService from 'primevue/dialogservice'
import Divider from 'primevue/divider'
import Dock from 'primevue/dock'
import Dropdown from 'primevue/dropdown'
import DynamicDialog from 'primevue/dynamicdialog'
import Fieldset from 'primevue/fieldset'
import FileUpload from 'primevue/fileupload'
import FloatLabel from 'primevue/floatlabel'
import FocusTrap from 'primevue/focustrap'
import Galleria from 'primevue/galleria'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Image from 'primevue/image'
import InlineMessage from 'primevue/inlinemessage'
import Inplace from 'primevue/inplace'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputMask from 'primevue/inputmask'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import InputOtp from 'primevue/inputotp'
import Knob from 'primevue/knob'
import Listbox from 'primevue/listbox'
import MegaMenu from 'primevue/megamenu'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import Message from 'primevue/message'
import MeterGroup from 'primevue/metergroup'
import MultiSelect from 'primevue/multiselect'
import OrderList from 'primevue/orderlist'
import OrganizationChart from 'primevue/organizationchart'
import OverlayPanel from 'primevue/overlaypanel'
import Paginator from 'primevue/paginator'
import Panel from 'primevue/panel'
import PanelMenu from 'primevue/panelmenu'
import Password from 'primevue/password'
import PickList from 'primevue/picklist'
import ProgressBar from 'primevue/progressbar'
import ProgressSpinner from 'primevue/progressspinner'
import Rating from 'primevue/rating'
import RadioButton from 'primevue/radiobutton'
import Row from 'primevue/row'
import SelectButton from 'primevue/selectbutton'
import ScrollPanel from 'primevue/scrollpanel'
import ScrollTop from 'primevue/scrolltop'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import Slider from 'primevue/slider'
import Sidebar from 'primevue/sidebar'
import SpeedDial from 'primevue/speeddial'
import SplitButton from 'primevue/splitbutton'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Stepper from 'primevue/stepper'
import Steps from 'primevue/steps'
import TabMenu from 'primevue/tabmenu'
import TieredMenu from 'primevue/tieredmenu'
import Textarea from 'primevue/textarea'
import Toolbar from 'primevue/toolbar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import Tab from 'primevue/tab'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import TabPanels from 'primevue/tabpanels'
import Terminal from 'primevue/terminal'
import Timeline from 'primevue/timeline'
import ToggleButton from 'primevue/togglebutton'
import Tree from 'primevue/tree'
import TreeSelect from 'primevue/treeselect'
import TreeTable from 'primevue/treetable'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(ToastService)
app.component('Accor-dion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('AutoComplete', AutoComplete)
app.component('Ava-tar', Avatar)
app.component('AvatarGroup', AvatarGroup)
app.component('Bad-ge', Badge)
app.component('BlockUI', BlockUI)
app.component('Bread-crumb', Breadcrumb)
app.component('But-ton', Button)
app.component('ButtonGroup', ButtonGroup)
app.component('Cal-endar', Calendar)
app.component('Ca-rd', Card)
app.component('CascadeSelect', CascadeSelect)
app.component('Check-box', Checkbox)
app.component('Ch-ip', Chip)
app.component('Ch-ips', Chips)
app.component('ColorPicker', ColorPicker)
app.component('Col-umn', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('ConfirmDialog', ConfirmDialog)
app.component('ConfirmPopup', ConfirmPopup)
app.component('ContextMenu', ContextMenu)
app.component('DataTable', DataTable)
app.component('DataView', DataView)
app.component('DeferredContent', DeferredContent)
app.component('Dia-log', Dialog)
app.component('Div-ider', Divider)
app.component('Do-ck', Dock)
app.component('Drop-down', Dropdown)
app.component('DynamicDialog', DynamicDialog)
app.component('Field-set', Fieldset)
app.component('FileUpload', FileUpload)
app.component('FloatLabel', FloatLabel)
app.component('Gall-eria', Galleria)
app.component('IconField', IconField)
app.component('Im-age', Image)
app.component('InlineMessage', InlineMessage)
app.component('Inp-lace', Inplace)
app.component('InputGroup', InputGroup)
app.component('InputGroupAddon', InputGroupAddon)
app.component('InputIcon', InputIcon)
app.component('InputMask', InputMask)
app.component('InputNumber', InputNumber)
app.component('InputSwitch', InputSwitch)
app.component('InputText', InputText)
app.component('InputOtp', InputOtp)
app.component('Kn-ob', Knob)
app.component('Lis-tbox', Listbox)
app.component('MegaMenu', MegaMenu)
app.component('Me-nu', Menu)
app.component('Men-ubar', Menubar)
app.component('Mess-age', Message)
app.component('MeterGroup', MeterGroup)
app.component('MultiSelect', MultiSelect)
app.component('OrderList', OrderList)
app.component('OrganizationChart', OrganizationChart)
app.component('OverlayPanel', OverlayPanel)
app.component('Pagi-nator', Paginator)
app.component('Pan-el', Panel)
app.component('PanelMenu', PanelMenu)
app.component('Pass-word', Password)
app.component('PickList', PickList)
app.component('ProgressBar', ProgressBar)
app.component('ProgressSpinner', ProgressSpinner)
app.component('RadioButton', RadioButton)
app.component('Rat-ing', Rating)
app.component('Ro-w', Row)
app.component('SelectButton', SelectButton)
app.component('ScrollPanel', ScrollPanel)
app.component('ScrollTop', ScrollTop)
app.component('Sel-ect', Select)
app.component('Sli-der', Slider)
app.component('Side-bar', Sidebar)
app.component('Skele-ton', Skeleton)
app.component('SpeedDial', SpeedDial)
app.component('SplitButton', SplitButton)
app.component('Spli-tter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('Ste-pper', Stepper)
app.component('St-eps', Steps)
app.component('TabMenu', TabMenu)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('T-ag', Tag)
app.component('T-ab', Tab)
app.component('Ta-bs', Tabs)
app.component('TabList', TabList)
app.component('TabPanels', TabPanels)
app.component('Text-area', Textarea)
app.component('Termi-nal', Terminal)
app.component('TieredMenu', TieredMenu)
app.component('Time-line', Timeline)
app.component('Too-lbar', Toolbar)
app.component('Toa-st', Toast)
app.component('ToggleButton', ToggleButton)
app.component('Tr-ee', Tree)
app.component('TreeSelect', TreeSelect)
app.component('TreeTable', TreeTable)

app.use(PrimeVue, {
  theme: themeConfig,
  ripple: true,
  zIndex: {
    modal: 1100,
    overlay: 1000,
    menu: 1000,
    tooltip: 1100,
  },
})
app.use(MotionPlugin)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ToastPlugin, {
  position: 'top',
})

import { useAuthStore } from '@/stores/shared/auth.ts'
const authStore = useAuthStore()

authStore.initialize().then((r) => {})

app.mount('#app')
