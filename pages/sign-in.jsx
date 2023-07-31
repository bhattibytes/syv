/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
// import Footer from '../components/footer';
import axios from 'axios';
import Link from 'next/link';
import FacebookIcon from '@material-ui/icons/Facebook';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';

const initialValues = {
  email: '',
  password: '',
};

const SignIn = () => {
  const [values, setValues] = useState(initialValues);
  const [showError, toggleShowError] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (values.email && values.password) {
        const response = await axios({
          url: 'https://syv-theta.vercel.app/api/auth/local',
          method: 'POST',
          data: values,
        });
        router.push(response.data.redirect);
      }
    }
    catch (err) {
      console.log(err.response);
      toggleShowError(true);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar>
        <div className="w-full h-full flex flex-col flex-grow mt-10 w-8/12 mx-auto">
          <form className="" style={{ zIndex: '50' }} onSubmit={handleSubmit}>
            <div>
              <fieldset className="flex flex-col gap-4 w-5/12 mx-auto pb-8">
                <input className="input-custom" name="email" refs="email" type="text" size="30" placeholder="Email" onChange={handleInputChange} value={values.email || ''} />
                <input className="input-custom" name="password" refs="password" type="password" size="30" placeholder="Password" onChange={handleInputChange} value={values.password || ''} />
                {showError && <span className="text-red-500">Invalid Credentials</span>}
                <input type="submit" value="Sign-In" className="btn btn-purple cursor-pointer" onClick={handleSubmit} />
                <Link href="https://syv-theta.vercel.app/api/auth/facebook">
                  <a className="transition btn text-center bg-blue-600 hover:bg-blue-700 text-white flex flex-row gap-2 justify-center items-center focus:bg-blue-800">
                    <FacebookIcon />
                    Login With Facebook
                  </a>
                </Link>
                <Link href="https://syv-theta.vercel.app/api/auth/google">
                  <a className="transition btn text-center gap-2 bg-white hover:bg-red-500 hover:text-white focus:text-white focus:bg-red-600 text-gray-800 h-full w-full flex flex-row justify-center items-center gap-2 group">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width={20} height={20} className="transistion-all group-hover:filter group-hover:grayscale group-hover:contrast-max group-hover:brightness-max" />
                    Login With Google
                  </a>
                </Link>
              </fieldset>
            </div>
          </form>
        </div>
      </Navbar>
    </div>
  );
};

export default SignIn;
