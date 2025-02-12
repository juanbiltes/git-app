import '@testing-library/jest-dom';
import { jest } from '@jest/globals'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    isReady: true,
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
  }),
})) 