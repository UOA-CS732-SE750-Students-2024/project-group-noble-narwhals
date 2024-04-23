function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(200).json({ isLoggedIn: false });
}

export default isLoggedIn;
