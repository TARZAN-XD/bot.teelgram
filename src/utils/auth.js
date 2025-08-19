
function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
}
function ensureAdmin(req, res, next){
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  return res.redirect('/login');
}
module.exports = { ensureAuth, ensureAdmin };
