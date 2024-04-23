import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export default function passportSetup(passport) {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("1Google it!!!", profile);
        User.findOne({ googleId: profile.id })
          .then((user) => {
            if (!user) {
              user = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                isVerification: true,
                name: profile.displayName,
                accountType: "google",
                avatar: profile.photos[0].value,
              });
              user.save().catch((err) => done(err, user));
              return done(null, user);
            } else {
              const simplifiedUser = {
                ...user.toObject(),
                password: undefined,
              };
              return done(null, simplifiedUser);
            }
          })
          .catch((err) => {
            return done(err);
          });

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
        User.findOne({ email: email })
          .then((user) => {
            if (!user)
              return done(null, false, { message: "Incorrect email." });
            if (!bcrypt.compareSync(password, user.password))
              return done(null, false, { message: "Incorrect password." });

            const simplifiedUser = { ...user.toObject(), password: undefined };
            return done(null, simplifiedUser);
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user._id);  // 日志用户的 _id
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    console.log('Deserializing user by id:', id);  // 日志用户的 _id
    User.findById(id)
    .populate({
      path: 'profileTags', 
      model: 'Tag'
    })
    .populate({
      path: 'participatingGroups', 
      populate: [{
        path: 'groupMembers',
        model: 'User'
      }, {
        path: 'groupApplicants',
        model: 'User'
      }, {
        path: 'groupTags',
        model: 'Tag'
      }, {
        path: 'ownerId',
        model: 'User',
      }]
    })
    .populate({
      path: 'likedGroups', 
      populate: [{
        path: 'groupMembers',
        model: 'User'
      }, {
        path: 'groupApplicants',
        model: 'User'
      }, {
        path: 'groupTags',
        model: 'Tag'
      }, {
        path: 'ownerId',
        model: 'User'
      }]
    })
    .populate({
      path: 'appliedGroups', 
      populate: [{
        path: 'groupMembers',
        model: 'User'
      }, {
        path: 'groupApplicants',
        model: 'User'
      }, {
        path: 'groupTags',
        model: 'Tag'
      }, {
        path: 'ownerId',
        model: 'User'
      }]
    })
      .then((user) => {
        const simplifiedUser = { ...user.toObject(), password: undefined };
        console.log('Deserialized user:', simplifiedUser);  // 日志用户的信息
        return done(null, simplifiedUser);
      })
      .catch((err) => {
        return done(err);
      });
  });
}
