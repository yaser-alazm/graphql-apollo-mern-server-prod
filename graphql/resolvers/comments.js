const { UserInputError, AuthenticationError } = require('apollo-server')

const Post = require('../../models/Post')
const checkAuth = require('../../utils/check-auth')

module.exports = {
    Mutation: {
        createComment: async (_, {postId, body}, context) => {
            const {username, avatar} = checkAuth(context)

            const post = await Post.findById(postId)

            // Check if body is empty string
            if(body.trim() === ''){
                throw new UserInputError('Comment should not be empty!', {
                    error: {
                        body: 'Comment should not be empty!'
                    }
                })
            }

            // Adding comment to the post
            if(post){
                post.comments.unshift({
                    username,
                    userAvatar: avatar,
                    body,
                    createdAt: new Date().toISOString()
                })

                await post.save()
                return post
            } else {
                throw new UserInputError('Post you are trying to comment is no more available!', {
                    errors: {
                        body: 'Post is not available any more!'
                    }
                })
            }
        },
        deleteComment: async (_, {postId, commentId}, context) => {
            const {username} = checkAuth(context)

            const post = await Post.findOne({_id: postId})

            if(post) {
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId)

                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1)
                    await post.save()

                    return post
                } else {
                    throw new AuthenticationError('You are not authorized to delete this comment!')
                }
            } else {
                throw new UserInputError('Post is not available any more!')
            }
        }
    }
}
