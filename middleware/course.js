import { Toast } from 'buefy/dist/components/toast'
export default function({ store, redirect }) {
  if (!store.state.courseTag) {
    Toast.open('Selecione um Curso')
    // eslint-disable-next-line no-console
    console.log('trying')
    redirect('/')
  }
}
