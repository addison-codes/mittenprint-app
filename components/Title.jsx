import React from 'react'

const Title = ({ text, children }) => {
  return (
    <h1 className="my-4 font-mono text-4xl font-bold text-gray-700 capitalize dark:text-white">
      {children ? children : text}
    </h1>
  )
}

export default Title
