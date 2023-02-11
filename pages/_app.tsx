import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Flowbite } from 'flowbite-react';
import theme from '../styles/flowbite-theme'
import NavbarSidebarLayout from '../components/layouts/NavbarSidebar';


function MyApp({ Component, pageProps }: AppProps) {
  return (

      <Flowbite theme={{ theme }}>
      <NavbarSidebarLayout>
        <Component {...pageProps} />
      </NavbarSidebarLayout>
      </Flowbite>
  )
}

export default MyApp
