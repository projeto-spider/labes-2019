import makeServices from '../front/service'

export default ({ app, $axios }, inject) => {
  inject('services', makeServices($axios))
}
