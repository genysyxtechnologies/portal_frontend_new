const processError = async (error: any) => {
  let message = ''
  // // console.log(error.response)
  if (error.response) {
    //user is not signed in
    if (error.response.status === 401) {
      if (error.config.url === '/authenticate') {
        message = 'Invalid username or password is not incorrect'
      } else if (error.config.url === '/refresh-token') {
        window.location.reload()
      } else {
        message = 'Session expired, login required'
      }
    } else if (error.response.status === 500) {
      // unauthorized access
      message = 'An error has occurred. Contact the support team'
    } else if (error.response.status === 403) {
      // unauthorized access
      message = 'Access denied. reload if message persist'
    } else if (error.response.status === 500) {
      message = "Ongoing maintenance, we'll be right back!"
    }
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    else if (error.response.data.message) {
      message = error.response.data.message
    } else if (error.response.data.error) {
      message = error.response.data.error
    } else {
      // check if its a blob
      if (error.response.data instanceof Blob) {
        // convert to blob
        message = await toJson(error.response.data)
      } else message = error.response.data
    }
    // viewInstance.message = "An error has occurred";
  } else if (error.request) {
    message = 'Error! server is not responding'
  } else {
    // Something happened in setting up the request that triggered an Error
    message = error.message
  }

  return message
}

const toJson = async (err: any) => {
  // eslint
  const r = await err.text()
  const parsed = JSON.parse(r)
  // check
  if (parsed.error) {
    return parsed.error
  } else {
    return parsed.message
  }
}

export { processError }
