export default ({ $axios }, inject) => {
  inject('getService', (url, params) => {
    return $axios.get(url, params)
  })

  inject('postService', (url, payload) => {
    return $axios.post(url, payload)
  })

  inject('putService', (url, payload) => {
    return $axios.put(url, payload)
  })

  inject('deleteService', (url, params) => {
    return $axios.delete(url, params)
  })
}
