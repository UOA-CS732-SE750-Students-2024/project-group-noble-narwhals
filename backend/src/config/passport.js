import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";


export default function passportSetup(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true  // pass req to callback for req.user
  }, async (req, accessToken, refreshToken, profile, done) => {
    if (req.user) {
      // check if the user has a googleId
      if (!req.user.googleId) {
        console.log('No googleId found, linking Google account...');
        // if no googleId, link the account with Google
        req.user.googleId = profile.id;
        req.user.isVerification = true;
        await req.user.save();
        return done(null, req.user, { message: 'Google account linked and verified!' });
      } else {
        // if googleId exists, check if the googleId matches the profile id
        if (req.user.googleId === profile.id) {
          req.user.isVerification = true;
    
          await req.user.save();
          return done(null, req.user, { message: 'Google account verified!' });
        } else {
          return done(null, false, { message: 'Google account does not match the linked account.' });
        }
      }
    } else {
      // if user is not logged in, check if the user exists in the database
      const user = await User.findOne({ googleId: profile.id, accountType: 'google'});
      if (!user) {
        // if user does not exist, create a new user
        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          gender: "Not specified",
          isVerification: true,
          name: profile.displayName,
          accountType: "google",
          avatar: profile.photos[0].value,
        });
        await newUser.save();
        return done(null, newUser);
      } else {
        // if user exists, return the user
        return done(null, user);
      }
    }
  }));
  
  
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
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
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
        // we directly return the user object, no need to convert to JSON
        // because we are using Mongoose document, and only Mongoose document can be saved to session
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });
  });

}
