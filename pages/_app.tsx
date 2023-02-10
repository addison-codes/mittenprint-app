import '../styles/globals.css'
import MainLayout from '../components/layouts/MainLayout'
import type { AppProps } from 'next/app'
import { Auth0Provider } from '@auth0/auth0-react';
import { Flowbite } from 'flowbite-react';
import theme from '../styles/flowbite-theme'
import NavbarSidebarLayout from '../components/layouts/NavbarSidebar';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
    domain="dev-ut93f2j5.us.auth0.com"
    clientId="PYP7p44tmtp2xvuoOBe0zhxfaQcf3PYt"
    redirectUri={'http://localhost:3000/'}
    >
      <Flowbite theme={{ theme }}>
      <NavbarSidebarLayout>
        <Component {...pageProps} />
      </NavbarSidebarLayout>
      </Flowbite>
    </Auth0Provider>
  )
}

export default MyApp
