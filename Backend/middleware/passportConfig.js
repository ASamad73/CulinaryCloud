// middleware/passportConfig.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Adjust the path if necessary

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // from your .env file
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find the user by Google ID or by email; adjust logic to suit your app.
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If user not found, create a new user with Google details.
          user = new User({
            email: profile.emails[0].value,
            name: profile.displayName,
            auth: {
              google: { id: profile.id }
            },
            // You can also store profile photo URL if you wish.
          });
          await user.save();
        } else if (!user.auth.google) {
          // If the user exists from local registration but hasn't linked Google, add the Google ID.
          user.auth.google = { id: profile.id };
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        console.error("Google OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
