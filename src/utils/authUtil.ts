
import TabUtil from "@/utils/tabutil";
import {getBrowserInfo} from "@/utils/BrowserUtil";

export const checkAuth =  () => {
  // check for request data passing
  if(window.location.href.includes("?data")) {
    const data = TabUtil.extractData(window.location.search)
    //console.log("Data", data)
    // get browser info
    const info = `${getBrowserInfo().userAgent}`
    if(data) {
      // if copied from another browser
      if(info !== data.info)
        return false;

      sessionStorage.setItem('auth_token', data.key)
      sessionStorage.setItem('isAuthenticated', 'true')
      sessionStorage.setItem('roles', JSON.stringify(['student']))
      // this.setAccessToken(data.key)
      // this.setRefreshToken(data.key2)
      window.location.href = window.location.href.substring(0, window.location.href.indexOf("?data"))
      return true
    }
  }

  // check if user is logged in
  const loggedIn = sessionStorage.getItem('auth_token') && sessionStorage.getItem('isAuthenticated') === 'true' && sessionStorage.getItem('roles')
  // if logged in, return success promise
  return !!loggedIn;
}
