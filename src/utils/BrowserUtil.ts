export function getBrowserInfo() {
    return {
        appName: navigator.appName, // application name of the browser
        appVersion: navigator.appVersion, // version information of the browser
        userAgent: navigator.userAgent, // user-agent header sent by the browser to the server
        platform: navigator.platform, // platform on which the browser is being run
        language: navigator.language, // language of the browser interface
    };
}
