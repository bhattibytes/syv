/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';

import { UserContext } from '../../state/user-context';

import Dashboard from '../../components/dashboard';
import ElectionCard from '../../components/dashboard/election-card';

import voterInfoData from '../../samples/voterInfoQuery';
import voterInfoQuery from '../../samples/voterInfoQuery';

export default function DashboardHome(props) {
  return (
    <Dashboard>
      <UserContext.Provider value={props.user}>
        <div className="flex flex-col h-full">
          <div className="text-4xl pl-8 pt-8 text-gray-800 font-bold">
            Your Upcoming Elections
          </div>
          <div className="text-2xl pl-8 text-gray-500 font-light">
            View voting, election, and representative information based on your location
          </div>
          <div className="shadow-xl m-8 mt-8 flex-grow rounded-xl">
            <ElectionCard election={props.voterInfo} />
          </div>
        </div>
      </UserContext.Provider>
    </Dashboard>
  );
}

export async function getServerSideProps(context) {
  const key = process.env.CIVIC_API;

  const { cookie } = context.req.headers;
  try {
    const res = await axios.get('https://syv-theta.vercel.app/api/user', { headers: { cookie } });
    const { user } = res.data;
    let voterInfo;
    if (user.address) {
      const address = `${user.address.street},${user.address.city},${user.address.state},${user.address.zip}`;
      voterInfo = (await axios.get('https://www.googleapis.com/civicinfo/v2/voterinfo', { params: { key, address, electionId: 2000 } })).data;
    }
    return {
      props: {
        voterInfo,
        user,
      },
    };
  } catch (err) {
    return {
      redirect: { destination: '/sign-in', permanent: false },
    };
  }
}
