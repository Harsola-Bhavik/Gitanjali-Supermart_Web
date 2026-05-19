const supabase = require('../config/supabase');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Access token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(403).json({ success: false, error: 'Token is invalid or expired' });
  }

  req.user = user;
  next();
};

module.exports = verifyToken;
