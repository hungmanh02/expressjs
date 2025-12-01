import passport from "passport";

import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword, hashPassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  //   console.log("Inside Serialize User");
  //   console.log(user);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        const findUser = await User.findOne({ username });
        if (!findUser) throw new Error("User not found");
        if (!comparePassword(password, findUser.password))
          throw new Error("Bab Credentials");
        done(null, findUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
