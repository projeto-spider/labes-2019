export default function({ store, error, redirect }) {
  if (!store.state.auth.user) {
    redirect('/login')
  }
}
