import { Toast } from 'buefy/dist/components/toast'

export default function({ $axios, store, redirect }) {
  $axios.setToken(store.state.auth.token, 'Bearer')
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (
      code === 400 &&
      error.response.data.code === process.env.errors.INVALID_TOKEN
    ) {
      Toast.open({
        type: 'is-danger',
        message: 'Login expirado',
        duration: 5000
      })
      store.dispatch('auth/logout')
      redirect('/login')
    } else if (error.message === 'Network Error') {
      Toast.open({
        type: 'is-danger',
        message: 'Ocorreu um erro na conexão'
      })
    } else {
      throw error
    }
  })
}
