const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeaders = req.header('authorization');
  const token = authHeaders && authHeaders.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided...' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token...' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. This feature is only available to administrators.' 
    });
  }
  next();
}

function requireMemberOrAdmin(req, res, next) {
  if (req.user.role !== 'member' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. This feature is only available to family members or administrators.' 
    });
  }
  next();
}

module.exports = {
  auth,
  requireAdmin,
  requireMemberOrAdmin,
};
