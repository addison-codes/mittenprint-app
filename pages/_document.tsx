import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script type='text/javascript' src='https://maps.googleapis.com/maps/api/js?key=AIzaSyDLYwDTeQoptjd9E1AxaHoUrHujcRyo_a4&libraries=places' defer></script>
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}