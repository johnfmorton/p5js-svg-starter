export function sanitizeFilename(filename) {
  // Remove invalid characters (\/:*?"<>|), replace spaces with underscores, and convert to lowercase
  return filename
    .replace(/[\/:*?"<>|]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase()
}
