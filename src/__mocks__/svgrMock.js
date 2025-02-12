'use strict'
const React = require('react')

const SvgrMock = React.forwardRef((props, ref) => {
  return React.createElement('svg', {
    ...props,
    ref,
    'data-testid': 'svg-mock',
  })
})

SvgrMock.displayName = 'SvgrMock'

module.exports = {
  __esModule: true,
  default: SvgrMock,
} 