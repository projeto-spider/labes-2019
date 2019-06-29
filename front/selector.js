export default function selector(data, getList, defaults = {}) {
  if (data && typeof data === 'object') {
    const selected = { ...defaults }
    for (const d in data) {
      if (data.hasOwnProperty(d) && getList.includes(d)) {
        selected[d] = data[d]
      }
    }
    return selected
  }
}
