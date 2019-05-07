export default function({ store, error, redirect }) {
  if (!store.state.auth.user) {
    error({
      message: 'You are not connected',
      statusCode: 403
    })
    redirect('/login')
  }
}
