export default function select(data, getList, defaults = {}) {
  if (data && typeof data === 'object') {
    const selected = {}
    for (const d in data) {
      if (getList.includes(d)) {
        selected[d] = data[d]
      } else if (defaults[d]) {
        selected[d] = defaults[d]
      }
    }
    return selected
  }
}
