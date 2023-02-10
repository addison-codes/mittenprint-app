import Login from './Login'
import Logout from './Logout'
import Profile from './Profile'
import Link from 'next/link'
import Title from './Title'

const Navbar = () => {
  return (
    <nav className="bg-gray-900">
      <div className="container py-8 mx-auto">
        <h1 id="title" className="font-mono text-2xl">
          <Link
            className="my-4 font-mono text-4xl font-bold text-white capitalize"
            href="/"
          >
            Mitten Print Distribution
          </Link>
        </h1>
        <Login />
        <Logout />
        <Profile />
      </div>
    </nav>
  )
}

export default Navbar
