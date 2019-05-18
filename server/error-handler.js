module.exports = function errorHandler(ctx, next) {
  return next().catch(err => {
    console.error(err) // eslint-disable-line
    ctx.status = 500
    ctx.body = 'Internal Server Error'
  })
}
