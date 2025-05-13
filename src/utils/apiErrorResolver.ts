import { AxiosError } from 'axios'

const processError = async (error: AxiosError) => {
  console.log(error)
  let message = ''
  // console.log(error.response)
  if (error.response) {
    //user is not signed in
    if (error.response.status === 401) {
      if (error.config && error.config.url === '/authenticate') {
        message = 'Invalid username or password is not incorrect'
      } else if (error.config && error.config.url === '/refresh-token') {
        window.location.reload()
      } else {
        message = 'Session expired, login required';
      }
    } else if (error.response.status === 500 ) { // unauthorized access
      message = 'An error has occurred. Contact the support team'
    } else if (error.response.status === 403) { // unauthorized access
      message = 'Access denied. reload if message persist'
    } else if(error.response.status === 500){
      message = "Ongoing maintenance, we'll be right back!"
    }
    // that falls out of the range of 2xx
    if(error.response.data instanceof Blob){
      // convert to blob
      message = await toJson(error.response.data)
    }
    else if (typeof error.response.data === 'object' && error.response.data !== null && 'message' in error.response.data && typeof error.response.data.message === 'string') {
      message = error.response.data.message
    } else if (typeof error.response.data === 'object' && error.response.data !== null && 'error' in error.response.data && typeof error.response.data.error === 'string') {
      message = error.response.data.error
    } else {
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else {
        message = 'An unknown error occurred.';
      }
    }
    // viewInstance.message = "An error has occurred";
  } else if (error.request) {
    message = "Error! server is not responding"
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    message = error.message;
  }

  return message
}

const toJson = async (err: Blob) =>  {
  // eslint
  const r = await err.text()
  const parsed = JSON.parse(r);
  // check
  if (parsed.error) {
    return parsed.error
  } else {
    return parsed.message
  }
}

export {
  processError
}
