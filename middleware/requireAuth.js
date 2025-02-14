const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {

    //verify auth
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const token = authHeader.split(' ')[1]; // Extract token
        const decoded = jwt.verify(token, process.env.SECRET);


        req.user = await User.findById(decoded._id).select('_id'); // Attach user to request

        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ error: 'Token is not valid' });
    }


}
 
module.exports = requireAuth