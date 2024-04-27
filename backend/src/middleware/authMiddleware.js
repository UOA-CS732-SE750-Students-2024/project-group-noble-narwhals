function isLoggedIn(req, res, next) {
  console.log("enter isLoggedIn, req.isAuthenticated(): ", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ isLoggedIn: false });
}

function isVerifiedUser(req, res, next) {
  if (req.isAuthenticated() && req.user.isVerification) {
    return next();
  }
  res.status(401).json({ isLoggedIn: false });
}

export default isLoggedIn;
export { isVerifiedUser };
