/* eslint-disable */
import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth'
import User from '../../models/User';
const GoogleStrategy = OAuth2Strategy

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //callbackURL -> after logging in redirected to
    callbackURL: "https://syv-theta.vercel.app/api/auth/google/callback",
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOne({ email:  profile.emails[0].value })
        .then((user) => {
          // if a user exists, return the user
          if (user) {
            return done(null, user);
          } else {
            // create user via google sign up
            User.create({ firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value })
            .then((user) => {
              return done(null, user)
            })
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }
));

// Serialize Google users based off ids for sessions
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// Log out Google users
passport.deserializeUser((req, id, done) => {
  // find the user
  User.findOne({_id: id}, (err, user) => {
    if (err) {
      return err;
    }
    done(null, user)
  });
});

export default passport;