import { render } from '@testing-library/react';
import Document from '../../pages/_document';
import { Html, Head, Main, NextScript } from 'next/document';

// Mock next/document components
jest.mock('next/document', () => ({
  Html: jest.fn(({ children, ...props }) => (
    <html {...props} data-testid="html">
      {children}
    </html>
  )),
  Head: jest.fn(({ children }) => (
    <head data-testid="head">
      {children}
    </head>
  )),
  Main: jest.fn(() => <main data-testid="main" />),
  NextScript: jest.fn(() => <script data-testid="nextscript" />)
}));

describe('_document', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders document with correct structure', () => {
    const { getByTestId } = render(<Document />);

    // Verify components are rendered
    expect(getByTestId('html')).toBeInTheDocument();
    expect(getByTestId('head')).toBeInTheDocument();
    expect(getByTestId('main')).toBeInTheDocument();
    expect(getByTestId('nextscript')).toBeInTheDocument();

    // Verify Html props
    expect(Html).toHaveBeenCalledWith(
      expect.objectContaining({
        lang: 'en'
      }),
      expect.anything()
    );
  });
}); 