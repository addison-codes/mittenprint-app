import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Flowbite } from 'flowbite-react';
import theme from '../styles/flowbite-theme'
import NavbarSidebarLayout from '../components/layouts/NavbarSidebar';
import {SessionProvider } from 'next-auth/react'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Flowbite theme={{ theme }}>
        <NavbarSidebarLayout isFooter >
          <Component {...pageProps} />
        </NavbarSidebarLayout>
      </Flowbite>
      </SessionProvider>
  )
}

export default MyApp
