/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/destructuring-assignment */
// /* eslint-disable react/prop-types */
import SwipeableViews from 'react-swipeable-views';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  Tabs, Tab, Box, Typography,
} from '@material-ui/core';
import data from '../../../components/mapData';
import Dashboard from '../../../components/dashboard';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

export default function State(props) {
  const [view, setView] = useState(0);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');
  const theme = React.useMemo(() => createMuiTheme({
    palette: { type: prefersDarkMode ? 'dark' : 'light' },
  }), [prefersDarkMode]);
  return (
    <ThemeProvider theme={theme}>
      <Dashboard>
        <div className="lg:w-8/12 w-10/12 mx-auto flex flex-col mb-6">
          <h1 className="text-6xl font-black text-gray-800 uppercase pt-8 text-center">{props.stateName}</h1>
          <Image className="p-4" src={`http://www.theus50.com/images/state-licenses/${props.stateNameOne}-license.jpg`} layout="responsive" width={800} height={200} objectFit="contain" alt={props.stateName} />
          <div className="self-center justify-self-center pt-4">
            <Link href="/dashboard/map">
              <a className="btn btn-purple flex-grow-0 text-center">
                Back To Interactive Map
              </a>
            </Link>
          </div>
          <br />
          <Tabs
            onChange={(_, e) => setView(e)}
            value={view}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="voter info tabs"
          >
            <Tab label="Absentee Ballot Process" {...a11yProps(0)} />
            <Tab label="Early Voting Process" {...a11yProps(1)} />
            <Tab label="Official Election Results" {...a11yProps(2)} />
            <Tab label="Poll Worker Information" {...a11yProps(3)} />
            <Tab label="Provisions for Voters with Disabilities" {...a11yProps(4)} />
            <Tab label="Voting Machines" {...a11yProps(5)} />
          </Tabs>
          <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={view} onChangeIndex={(e) => setView(e)} style={{ height: '100%' }}>
            <TabPanel value={view} index={0} dir={theme.direction}>
              <p>{props.ballotProcess}</p>
            </TabPanel>
            <TabPanel value={view} index={1} dir={theme.direction}>
              <p>{props.voteEarly}</p>
            </TabPanel>
            <TabPanel value={view} index={2} dir={theme.direction}>
              <p>{props.results}</p>
            </TabPanel>
            <TabPanel value={view} index={3} dir={theme.direction}>
              <p>{props.pollWorker}</p>
            </TabPanel>
            <TabPanel value={view} index={4} dir={theme.direction}>
              <p>{props.disabledVoter}</p>
            </TabPanel>
            <TabPanel value={view} index={5} dir={theme.direction}>
              <p>{props.votingTypes}</p>
            </TabPanel>
          </SwipeableViews>
        </div>
      </Dashboard>
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const dataStates = data();
  const stateAbbr = context.query.state;
  const state = dataStates[stateAbbr];
  const stateNameNormalized = state.name.replace(/\s+/g, '').toLowerCase();

  return {
    props: {
      stateNameOne: stateNameNormalized,
      stateName: state.name,
      stateDimensions: state.dimensions,
      ballotProcess: state.absenteeBallotProcess,
      voteEarly: state.earlyVoting,
      results: state.officialResults,
      pollWorker: state.pollWorkerInformation,
      disabledVoter: state.provisionsForVotersWithDisabilities,
      votingTypes: state.votingMachine,
      stateAbbrev: stateAbbr,
    },
  };
}
