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
