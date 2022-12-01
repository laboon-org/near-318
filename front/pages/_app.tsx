import '../styles/globals.scss'

import type { AppProps } from 'next/app'
import Layout from '../components/Layout/Layout'
import { RootStoreProvider } from '../providers/RootStoreProvider';
import '../styles/fonts.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RootStoreProvider>
      <Layout>
        <div id="app-modal"/>
        <Component {...pageProps} />
      </Layout>
    </RootStoreProvider>
  )
}
