import jwt from 'jsonwebtoken';
import { DataStore } from '../config/dataStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_campusos_bput_2026');
    req.user = await DataStore.findUserById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized. User record not found.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized. Token invalid or expired.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Admin privileges required.' });
  }
};
