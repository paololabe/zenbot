let z = require('zero-fill')
  , n = require('numbro')

module.exports = function container(get, set, clear) {
  return {
    name: 'Momentum',
    description: 'MOM = Close(Period) - Close(Length)',

    getOptions: function () {
      this.option('momentum_size', 'number of periods to look back for momentum', Number, 5)
    },

    calculate: function (s) {
      if (s.in_preroll) { return }
      get('lib.momentum')(s, 'mom0', s.options.momentum_size)
      get('lib.momentum')(s, 'mom1', s.options.momentum_size)
    },

    onPeriod: function (s, cb) {
      if (s.in_preroll) {
        cb()
        return
      }

      if (s.period.mom0 > 0 && s.period.mom1 > 0) {
        s.signal = 'buy'
      }
      if (s.period.mom0 < 0 && s.period.mom1 < 0) {
        s.signal = 'sell'
      }
      cb()
    },

    onReport: function (s) {
      var cols = []

      if (s.period.mom0 != null) {
        var color = s.period.mom0 < 0 ? 'red' : s.period.mom0 > 0 ? 'green' : 'grey'
        cols.push(z(5, n(s.period.mom0).format('000'), ' ')[color])
      } else {
        cols.push(' '.repeat(5))
      }
      if (s.period.mom1 != null) {
        var color = s.period.mom1 < 0 ? 'red' : s.period.mom1 > 0 ? 'green' : 'grey'
        cols.push(z(5, n(s.period.mom1).format('000'), ' ')[color])
      } else {
        cols.push(' '.repeat(5))
      }
      return cols
    }
  }
}
