export default function({ $axios, store }) {
  $axios.setToken(store.state.auth.token, 'Bearer')
}
