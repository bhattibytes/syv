/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Drawer } from '@material-ui/core';

import { DateTime } from 'luxon';

import ContestsContainer from './contests-container';
import GeneralInfoContainer from './general-info';
import SelectedContestDrawer from './selected-contest-drawer';

export default function ElectionCard({ election }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const router = useRouter();

  const getDateObjects = () => {
    const date = DateTime.fromISO(election.election.electionDay);

    return (
      <>
        <span className="text-2xl text-gray-900 font-bold">{date.toLocaleString({ day: '2-digit' })}</span>
        <span className="text-lg bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-900 font-black uppercase">{date.toLocaleString({ month: 'short' })}</span>
      </>
    );
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setDrawerOpen(true);
  };

  return (
    <div>
      <div className="m-4 flex gap-x-4">
        <div className="bg-gray-200 inline-flex flex-col items-center py-3 px-5 rounded-xl shadow-md">
          {getDateObjects()}
        </div>
        <span>
          <div className="text-gray-900 text-2xl font-bold align-middle">{election.election.name}</div>
          {/* <div className="text-gray-900 text-lg font-light italic">
            {`${election.state[0].local_jurisdiction.name}, ${election.state[0].name}`}
          </div> */}
        </span>
        <button className="justify-self-end self-center ml-auto btn btn-purple flex flex-row gap-2 items-center" onClick={() => router.push('/dashboard/ballot')}>
          Vote Here
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <GeneralInfoContainer state={election.state} />
      <div className="m-4">
        <ContestsContainer election={election} onCardClick={handleCardClick} />
      </div>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="right">
        <SelectedContestDrawer contest={selectedCard} />
      </Drawer>
    </div>
  );
}
