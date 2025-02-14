const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  }, 
  gender: {
    type: String,
    required: true
  }, 
  dob: {
    type: String,
    required: true
  }, 
  country: {
    type: String,
    required: true
  }
})

//static sigup method
userSchema.statics.signup = async function(username, password, fullname, gender, dob, country) {
  // validation
  if (!username || !password || !fullname || !gender || !dob || !country) {
    throw Error('All fields must be filled')
  }

  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ username })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ username, password: hash, fullname, gender, dob, country})

  return user
}

//static login
userSchema.statics.login = async function (username, password) {
  // validation
  if (!username || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ username })

  if (!user) {
    throw Error('Incorrect username')
  }

  const match = await bcrypt.compare(password, user.password)

  if(!match){
    throw Error('Incorrect password')
  }

  return user

}

module.exports = mongoose.model('User', userSchema)