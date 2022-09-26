import Navbar from '../Navbar'

const MainLayout = ({ children }) => {
  return (
    // Basic layout to wrap children elements with Navbar component
    <div
      className="bg-fixed bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(background.svg)` }}
    >
      <Navbar />
      <main className="container mx-auto ">{children}</main>
    </div>
  )
}

export default MainLayout
