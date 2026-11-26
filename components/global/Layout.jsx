import React from 'react'
import Header from './Header'
import Footer from './Footer'
import MobileBottomNav from './MobileBottomNav'
import CompleteProfileModal from './CompleteProfileModal'

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
          <CompleteProfileModal user={user} />
    </>
  )
}

export default Layout
