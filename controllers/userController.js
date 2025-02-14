const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const requireAuth = require('../middleware/requireAuth')

const createToken = (_id) => {
  const secret = process.env.SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  return jwt.sign({_id}, secret, { expiresIn: '3d' });
}
// login a user
const loginUser = async (req, res) => {
  const {username, password} = req.body
  console.log(username, password, req.body)

  try {
    const user = await User.login(username, password)

    //create token
    const token = createToken(user._id)

    res.status(200).json({username, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {username, password, fullname, gender, dob, country} = req.body
  console.log(username, password, fullname, gender, dob, country, req.body)
  try {
    const user = await User.signup(username, password, fullname, gender, dob, country)

    //create token
    const token = createToken(user._id)

    res.status(200).json({username, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const userdetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      fullname: user.fullname,
      gender: user.gender,
      dob: user.dob,
      country: user.country
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { signupUser, loginUser, userdetails }