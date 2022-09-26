import Login from '../components/Login'
import Logout from '../components/Logout'
import Profile from '../components/Profile'

const Navbar = () => {
  return (
    <nav className="bg-gray-900">
      <div className="container py-8 mx-auto">
        <h1 id="title" className="font-mono text-2xl">
          Mitten Print Distribution
        </h1>
        <Login />
        <Logout />
        <Profile />
      </div>
    </nav>
  )
}

export default Navbar
