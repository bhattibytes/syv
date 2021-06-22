import nextConnect from 'next-connect';
import middleware from '../../server/middlewares';
import User from '../../server/models/User';
import Tally from '../../server/models/Tally';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
  // console.log({ req });
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (req.user.hasVoted) {
      res.status(400).json({ message: 'user has already voted' });
    }
    const votes = req.body.map((vote) => (
      Tally.updateOne(vote, { $inc: { count: 1 } }, { upsert: true })
    ));
    await Promise.all(votes);
    // eslint-disable-next-line no-underscore-dangle
    await User.updateOne({ _id: req.user._id }, { hasVoted: true });
    res.status(201).json({ message: 'ballot counted' });
  } catch (err) {
    res.status(500).json({ message: 'something went wrong while counting ballot' });
  }
});

export default handler;
