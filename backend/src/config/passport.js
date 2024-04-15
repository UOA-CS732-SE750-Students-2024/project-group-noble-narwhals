import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

export default function passportSetup(passport){
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, cb) => {
        console.log("1Google it!!!",profile)
        // User.findOne({ googleId: profile.id }, (err, user) => {
        //     if (!user) {
        //         user = new User({ googleId: profile.id, email: profile.emails[0].value });
        //         user.save(err => cb(err, user));
        //     } else {
        //         return cb(err, user);
        //     }
        // });
        return cb(null, profile);
      }
    )
  );

  // Local Strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        // User.findOne({ email: email }, (err, user) => {
        //     if (err) return done(err);
        //     if (!user) return done(null, false, { message: 'Incorrect email.' });
        //     if (!bcrypt.compareSync(password, user.password)) return done(null, false, { message: 'Incorrect password.' });
        //     return done(null, user);
        // });
        return done(null, profile);
      }
    )
  );

//   passport.serializeUser((user, done) => done(null, user.id));
//   passport.deserializeUser((id, done) => {
//     // User.findById(id, (err, user) => done(err, user));
//   });
};
