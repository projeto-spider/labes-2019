import { Toast } from 'buefy/dist/components/toast'
export default function({ store, redirect }) {
  if (!store.state.courseTag) {
    const currentUser = store.state.auth.user
    Toast.open('Selecione um Curso')
    if (currentUser.role === 'admin') {
      redirect('/')
    } else if (currentUser.role === 'teacher') {
      redirect('/teacher/home')
    }
  }
}
