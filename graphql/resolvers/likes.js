const {UserInputError} = require('apollo-server')

const Post = require('../../models/Post')
const checkAuth = require('../../utils/check-auth')

module.exports = {
    Mutation: {
        createLike: async (_, {postId}, context) => {
            const {username} = checkAuth(context)

            const post = await Post.findOne({_id: postId})

            if(post) {
                //check if the user already liked the post or not
                if(post.likes.find(like => like.username === username)){
                    // unlike the post
                    post.likes = post.likes.filter(like => like.username !== username)
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save()
                return post
            } else throw new UserInputError('Post not vailable any more!')
        }
    }
}