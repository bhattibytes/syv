/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import '../styles/globals.css';
import axios from 'axios';
import Router from 'next/router';

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// eslint-disable-next-line consistent-return
export async function getServerSideProps(context) {
  if (Router.pathname.includes('/dashboard')) {
    try {
      const { cookie } = context.req.headers;
      const res = await axios.get('https://syv-theta.vercel.app/api/user', { headers: { cookie } });
      const { isLoggedIn } = res.data;

      if (isLoggedIn) {
        return {};
      }
    } catch (err) {
      return {
        redirect: { destination: '/sign-in', permanent: false },
      };
    }
  } else {
    return {};
  }
}

export default MyApp;
