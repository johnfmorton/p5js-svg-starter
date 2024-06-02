export function sanitizeFilename(filename) {
  // Remove invalid characters (\/:*?"<>|), replace spaces with underscores, and convert to lowercase
  return filename
    .replace(/[\/:*?"<>|]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

export function addUrlParam(key, value, obj) {
  // store existing params
  const params = new URLSearchParams(window.location.search)
  // don't store functions
  if (typeof obj[key] === 'function') {
    console.error(`Key ${key} is a function in the obj`)
    return
  }
  // set the new value
  params.set(key, value)
  console.log('addUrlParam', params.toString())

  window.history.pushState({}, '', `?${params}`) // set the new URL
}

export function saveParamsToUrl(obj) {
  // save all the obj params to the URL except functions
  for (const key in obj) {
    addUrlParam(key, obj[key], obj)
  }
}

export function loadParamsFromUrl(obj) {
  // check URL params
  const urlParams = new URLSearchParams(window.location.search)

  // for each URL param, set the value in the obj
  // to restore the state of the sketch
  urlParams.forEach((value, key) => {
    if (obj.hasOwnProperty(key)) {
      // if the key is a function defined in the obj, exit
      if (typeof obj[key] === 'function') {
        console.error(`Key ${key} is a function in the obj`)
        return
      }
      // if key is a number, set the value as a number
      if (!isNaN(Number(value))) {
        // debugger;

        obj[key] = Number(value)
      } else if (value === 'true' || value === 'false') {
        obj[key] = value === 'true'
      } else {
        obj[key] = value
      }
    }
  })
}

// single function to sync the URL params with the obj
export function initUrlParams(obj) {
  loadParamsFromUrl(obj)
  saveParamsToUrl(obj)
}


export function setPageTitle(title) {
  document.title = title
  // find the h1 element and set the text
  const h1 = document.querySelector('h1')
  if (h1) {
    h1.textContent = title
  }
}
