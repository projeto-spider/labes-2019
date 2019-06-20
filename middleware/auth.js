import { Toast } from 'buefy/dist/components/toast'
export default function({ store, error, redirect, route }) {
  if (!store.state.auth.user) {
    redirect('/login')
  }
  if (
    !route.path.includes('teacher') &&
    store.state.auth.user.role === 'teacher'
  ) {
    Toast.open('Usuario nao autorizado')
    redirect('/login')
  }
}
