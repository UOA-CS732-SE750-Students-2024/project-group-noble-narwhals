function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Not Authenticated");
}

export default isLoggedIn;
