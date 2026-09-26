import { useEffect, useState } from 'react';
import Router from 'next/router';
import Layout from '@/components/global/Layout';
import '@/styles/globals.css';
import Loading from '@/components/global/Loading';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { getUser } from '@/utils/Request';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleStart = (url, { shallow } = {}) => {
      if (!shallow) setLoading(true);
    };
    const handleComplete = () => setLoading(false);

    // Route change events
    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleComplete);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleComplete);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const cookies = nookies.get(); // Get cookies
      const token = cookies.access; // Access token from cookies

      if (token) {
        setIsAuthenticated(true);
        // Fetch user data asynchronously
        const userInfo = await getUser(token);
        setUser(userInfo);
  
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {/* {loading && <Loading />} */}
      <Toaster />
      <Layout isAuthenticated={isAuthenticated} user={user}>
       
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
