require('@testing-library/jest-dom')
require('whatwg-fetch')
const { TextEncoder, TextDecoder } = require('util')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Geist: () => ({
    className: 'geist-font',
    variable: '--font-geist-sans',
  }),
  Geist_Mono: () => ({
    className: 'geist-mono-font',
    variable: '--font-geist-mono',
  })
})) 