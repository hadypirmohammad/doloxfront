import React from 'react'
import Header from './Header'
import Footer from './Footer'
import MobileBottomNav from './MobileBottomNav'

const Layout = ({ children , user }) => {
  return (
    <>
      <Header user={ user } />
      <main>
        {React.Children.map(children, (child) =>
        React.cloneElement(child, { user }) // Pass user to each child
        )}
      </main>
          <Footer/>
          <MobileBottomNav />
    </>
  )
}

export default Layout
