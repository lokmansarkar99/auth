
export const protect = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('Not logged in');
  }
  next();
}