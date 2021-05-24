import nextConnect from 'next-connect';
import middleware from '../../server/middlewares';
import User from '../../server/models/User';
import passport from '../../server/middlewares/passport/passport-local';

// create handler for middleware
const handler = nextConnect();
handler.use(middleware);

handler.get(passport.authenticate('local'), (req, res) => {
  // return our user object
  console.log(req.user);
  res.json({ message:'Secret information' });
});

export default handler;
