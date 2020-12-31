const postResolvers = require('./posts')
const userResolvers = require('./users')
const commentResolvers = require('./comments')
const likeResolvers = require('./likes')

module.exports = {
    Post: {
        likesCount: (parent) => parent.likes.length,
        commentsCount: (parent) => parent.comments.length

    },
    Query: {
        ...postResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...likeResolvers.Mutation
    }
}