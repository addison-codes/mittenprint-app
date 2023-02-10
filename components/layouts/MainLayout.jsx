import Navbar from '../NavbarOld'

const MainLayout = ({ children }) => {
  return (
    // Basic layout to wrap children elements with Navbar component
    <div
      className="h-screen bg-fixed bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(background.svg)` }}
    >
      <Navbar />
      <main className="container mx-auto bg-fixed bg-center bg-no-repeat bg-cover">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
