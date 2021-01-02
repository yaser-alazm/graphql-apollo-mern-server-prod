const jwt = require('jsonwebtoken')
const {AuthenticationError} = require('apollo-server')

// const {JWT_SECRET_KEY} = require('../config')


module.exports = (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization

    if(authHeader){
        // authHeader = 'Bearer [token]'
        const token = authHeader.split('Bearer ')[1]

        if(token){
            try{
                const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
                return user
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token ..')
            }

        }else {
            throw new Error('Authontication token must be \'Bearer [token]\'')
        }

    } else {
        throw new Error('Authoriztion header must be provided ..')
    }
}