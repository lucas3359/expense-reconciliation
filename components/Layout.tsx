import React from 'react'
import Footer from './Footer'
import Header from './Header'

const Layout = ({ children }) => {
  return (
    <body className='bg-gradient-to-tl bg-gradient-to-r from-indigo-100 via-red-100 to-yellow-100'>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='container mx-auto py-5 px-2 flex-grow'>{children}</main>
        <Footer />
      </div>
    </body>
  )
}

export default Layout
