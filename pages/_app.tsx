import { AppProps } from 'next/dist/next-server/lib/router/router';
import '../static/semantic/dist/semantic.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
