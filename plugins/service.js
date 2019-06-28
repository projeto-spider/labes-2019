import makeServices from '../front/service'

export default ({ app, $axios }, inject) => {
  app.services = makeServices($axios)
}
