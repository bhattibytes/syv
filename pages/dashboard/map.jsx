/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import USAMap from 'react-usa-map';
import USAState from 'react-usa-map';
import { useRouter } from 'next/router';
import data from '../../components/mapData';
import Dashboard from '../../components/dashboard';

const dataStates = data();

export default function Map() {
  const router = useRouter();
  const mapHandler = (event) => {
    const stateAbbr = event.target.dataset.name;
    router.push(`../dashboard/map/${stateAbbr}`);
  };

  const buildPaths = () => {
    const paths = [];
    for (const stateKey in dataStates) {
      const path = (
        <USAState
          key={stateKey}
          stateName={dataStates[stateKey].name}
          dimensions={dataStates[stateKey].dimensions}
          state={stateKey}
          onClickState={mapHandler}
          fill="#333"
        />
      );
      paths.push(path);
    }
    return paths;
  };

  return (
    <Dashboard>
      <div className="flex flex-col bg-blue p-10 justify-center items-center">
        <h1 className="text-8xl font-black uppercase text-center">
          Get Information
        </h1>
        <h1 className="text-8xl font-black text-yellow-400 uppercase text-center" style={{ textShadow: '0 0 3px #ddd' }}>
          By State
        </h1>
        <div className="">
          <USAMap
            onClick={mapHandler}
            style={{ zIndex: 50 }}
            defaultFill="rgb(91 34 182)"
          />
          <g className="bg-black-500">{buildPaths}</g>
        </div>
      </div>
    </Dashboard>
  );
}
