const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')
const crypto = require('crypto')
const request = require('request')

const User = require('../../models/User')
const {JWT_SECRET_KEY} = require('../../config')
const {validateRegisterInput, validateLoginInput} = require('../../utils/validation')

generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
    }, JWT_SECRET_KEY, {expiresIn: '1h'})
}

module.exports = {
    Mutation: {
        async register(_, {registerInput: {username, password, confirmPassword, email} }) {
            // Validate user data
            const {errors, valid} = validateRegisterInput(username, password, confirmPassword, email);
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }
            // Make sure user doesn't already exists
            const user = await User.findOne({username})

            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is already taken'
                    }
                })
            }
            // Hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            // get the user avatar image
            const hashedEmail = await crypto.createHash('md5').update(email).digest("hex");

            const avatar = await `https://www.gravatar.com/avatar/${hashedEmail}.jpg`

            // await request(`https://www.gravatar.com/avatar/${hashedEmail}.jpg`,(err,response,body) => {
            //     if (!err){
            //         console.log(`https://www.gravatar.com/avatar/${hashedEmail}.jpg`);
            //     }else{
            //         console.log("Error: "+err);
            //     }
            // })

            // create new user
            const newUser = new User({
                username,
                password,
                email,
                createdAt: new Date().toISOString(),
                avatar
            })

            const res = await newUser.save()

            // create user token
            const token = generateToken(res);


            // debug
            //console.log('res ='+ res, 'token ='+ token)
            // console.log(res)
            return {
                id: res._id,
                username: res.username,
                email: res.email,
                createdAt: res.createdAt,
                avatar: res.avatar,
                token,
            }
        },
        async login(_, {username, password}){
            const {errors, valid} = validateLoginInput(username, password)

            if(!valid){
                throw new UserInputError('Errors', {errors})
            }

            //Check username
            const user = await User.findOne({username})

            if(!user){
                errors.general = 'User not found!'
                throw new UserInputError('User not found', {errors})
            }

            //Check password
            const match = await bcrypt.compare(password, user.password)

            if (!match){
                errors.general = 'Wrong credentials!'
                throw new UserInputError('Wrong credentials!', {errors})
            }

            const token = generateToken(user);

            return {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                avatar: user.avatar,
                token
            }

        }
    }
}