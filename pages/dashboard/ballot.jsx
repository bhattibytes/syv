/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable arrow-body-style */
/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dashboard from '../../components/dashboard';
import dummyData from '../../samples/voterInfoQuery';
import BallotAnimation from '../../components/dashboard/ballotAnimation';
// import Button from '@material-ui/core/Button';
import EnvelopeAnimation from '../../components/dashboard/envelope-animation';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Ballot({ voterInfo }) {
  const [animation, animate] = useState(false);
  const [ballot, setBallot] = useState({});
  const [open, setOpen] = useState(false);
  const [showAlert, setshowAlert] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheck = (office, input, district) => {
    const newBallot = JSON.parse(JSON.stringify(ballot));
    newBallot[office] = { check: input, id: district };
    setBallot(newBallot);
  };

  const handleWriteIn = (office, input, district) => {
    const newBallot = JSON.parse(JSON.stringify(ballot));
    newBallot[office] = { writeIn: input, id: district };

    if (newBallot[office].writeIn === '') {
      delete newBallot[office];
    }
    setBallot(newBallot);
  };

  const handleReferendum = (title, input, district) => {
    // console.log('input', input);
    const newBallot = JSON.parse(JSON.stringify(ballot));
    newBallot[title] = { vote: input, id: district };
    setBallot(newBallot);
  };

  const handleSubmit = () => {
    const ballotArr = [];

    for (const key of Object.keys(ballot)) {
      if (ballot[key].check !== undefined) {
        ballotArr.push({ name: ballot[key].check, contest: key, districtId: ballot[key].id });
      }
      if (ballot[key].writeIn !== undefined) {
        ballotArr.push({ name: ballot[key].writeIn, contest: key, districtId: ballot[key].id });
      }
      if (ballot[key].vote !== undefined) {
        ballotArr.push({ name: ballot[key].vote, contest: key, districtId: ballot[key].id });
      }
    }

    // console.log('ballot', ballotArr);
    axios.post('https://syv-theta.vercel.app/api/ballot', ballotArr)
      .then(async () => {
        await animate(true);
        await setOpen(true);
        await setshowAlert(false);
        setTimeout(() => {
          animate(false);
        }, 15000);
      })
      .catch(async (err) => {
        await setOpen(true);
        await setshowAlert(true);
        console.log(err.message);
      });
  };

  return (
    <Dashboard>
      <div className="p-5">
        {/* title */}
        <div className="bg-gray-100 m-2 p-4 shadow-lg rounded-md border border-solid border-gray-200">
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-4xl">{`${voterInfo.election.name} Ballot`}</h1>
            <h2 className="text-lg italic font-light">{voterInfo.election.electionDay}</h2>
            <h2 className="text-lg italic font-light">
              {`${voterInfo.normalizedInput.line1} ${voterInfo.normalizedInput.city}, ${voterInfo.normalizedInput.state} ${voterInfo.normalizedInput.zip}`}
            </h2>
          </div>
          {/* ballot information */}
          <div className="bg-gray-100 grid grid-cols-3 gap-x-5 gap-y-5 h-full p-5">
            {voterInfo.contests.map((contest, j) => {
              if (contest.type === 'General') {
                return (
                  <div key={j} className="border border-solid border-gray-600 p-4 rounded-md flex flex-col w-full">
                    <h1 className="font-bold">{contest.office}</h1>
                    <div className="flex flex-col gap-2">
                      {contest.candidates?.map((candidate, i) => {
                        return (
                          <React.Fragment key={i}>
                            <div className="flex flex-row justify-between w-full gap-4">
                              <div>{`${candidate.name}`}</div>
                              <div className="text-right">
                                {`${candidate.party} `}
                                <input
                                  type="radio"
                                  name={contest.office}
                                  onChange={() => (handleCheck(contest.office, candidate.name, contest.district.id))}
                                  checked={ballot[contest.office]?.check === candidate.name}
                                />
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <div className="flex flex-row items-center w-full mt-auto pt-4">
                      <label htmlFor="name" className="flex-shrink-0">Write-in</label>
                      <input
                        type="text"
                        name="name"
                        className="input-custom p-1 w-full"
                        value={ballot[contest.office]?.writeIn || ''}
                        onChange={(e) => handleWriteIn(contest.office, e.target.value, contest.district.id)}
                      />
                    </div>
                  </div>
                );
              }
              if (contest.type === 'Referendum') {
                return (
                  <div key={j} className="border border-solid border-gray-600 p-4 rounded-md flex flex-col">
                    <div>
                      <h1 className="font-bold">{contest.referendumTitle}</h1>
                      <h2>{contest.referendumSubtitle}</h2>
                    </div>
                    <div className="flex flex-row gap-4 mt-auto items-center justify-end">
                      <label htmlFor="Yes" className="flex flex-row gap-2 items-center">
                        Yes
                        <input id="Yes" name={contest.referendumTitle} type="radio" value="Yes" onClick={(e) => handleReferendum(contest.referendumTitle, e.target.value, contest.district.id)} />
                      </label>

                      <label htmlFor="No" className="flex flex-row gap-2 items-center">
                        No
                        <input id="No" name={contest.referendumTitle} type="radio" value="No" onClick={(e) => handleReferendum(contest.referendumTitle, e.target.value, contest.district.id)} />
                      </label>
                    </div>
                  </div>
                );
              }
            })}
            {/* Animation */}
            {animation ? (
              <Confetti width={document.documentElement.scrollWidth} height={document.documentElement.scrollHeight} />) : null}
            {animation ? <BallotAnimation /> : null}

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <>
                {!showAlert && (
                  <Alert onClose={handleClose} severity="success">
                    You Have Successfully Voted!
                  </Alert>
                )}
                {showAlert && (
                  <Alert onClose={handleClose} severity="error">
                    You've Already Voted! Securely.
                  </Alert>
                )}
              </>
            </Snackbar>

          </div>
          <div className="grid grid-cols-3 bg-gray-100 p-5">
            <br />
            <div className="btn btn-purple cursor-pointer text-center" onClick={handleSubmit}>Submit</div>
          </div>
        </div>

      </div>
    </Dashboard>
  );
}

export async function getServerSideProps(context) {
  const electionId = 2000;
  const key = process.env.CIVIC_API;

  const { cookie } = context.req.headers;
  try {
    const res = await axios.get('https://syv-theta.vercel.app/api/user', { headers: { cookie } });

    const { user } = res.data;

    let voterInfo;
    if (user.address) {
      const address = `${user.address.street},${user.address.city},${user.address.state},${user.address.zip}`;
      // voterInfo = dummyData; // (await axios.get('https://www.googleapis.com/civicinfo/v2/voterinfo', {params: {key, address, electionId} })).data;
      voterInfo = (await axios.get('https://www.googleapis.com/civicinfo/v2/voterinfo', { params: { key, address, electionId } })).data;
    }
    return {
      props: {
        voterInfo,
        user,
      },
    };
  } catch (err) {
    console.log(err.message);
  }
}
