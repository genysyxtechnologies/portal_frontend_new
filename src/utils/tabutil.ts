import TextUtil from '@/utils/TextUtil'
import {getBrowserInfo} from '@/utils/BrowserUtil'

const TabUtil = {
    openNew(key: string, key2: string, link: string){
        const info = `${getBrowserInfo().userAgent}`
        const data = {
            token: TextUtil.generateUID(15),
            auth: TextUtil.generateUID(20),
            rf: key,
            df: key2,
            info: info
        };
        const dataString = JSON.stringify(data);
        const dataStringBase64 = window.btoa(dataString); // (optional)
        const dataStringBase64Safe = encodeURIComponent(dataStringBase64);
        const url = `${link}?data=${dataStringBase64Safe}`;
        window.open(url, '_blank');
    },

    extractData(data: string){
        const urlParams = new URLSearchParams(data); // supported on most modern browsers
        const dataStringBase64Safe: string = urlParams.get('data') as string;
        const dataStringBase64 = decodeURIComponent(dataStringBase64Safe);
        const dataString = window.atob(dataStringBase64);
        const object = JSON.parse(dataString);
        return {
            key: object.rf,
            key2: object.df,
            info: object.info
        }
    }
}
 export default TabUtil
