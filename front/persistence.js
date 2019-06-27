export function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function recovery(key) {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : false
}
