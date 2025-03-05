import type { AppProps } from "next/app";
import Head from "next/head";
import "~/styles/globals.css";
import ErrorBoundary from '../common/components/ErrorBoundary/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Head>
        <title>Git Challenge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
