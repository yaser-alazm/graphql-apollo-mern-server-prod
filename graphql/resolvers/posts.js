const {AuthenticationError, UserInputError} = require('apollo-server')

const Post = require('../../models/Post')
const checkAuthUser = require('../../utils/check-auth')

module.exports = {
    Query: {
        getPosts: () => {
            try{
                const posts = Post.find().sort({createdAt: -1});
                return posts;
            }catch(err) {
                throw new Error(err)
            }
        },
        getPost: async (_, {postID}) => {
            // Post.findOne({_id: postID}).then(post => console.log(post)).catch(err => {
            //     throw new Error(err)
            // })

            try{
                const post = await Post.findById(postID)
                // console.log(post)
                if(post){
                    return post
                }else {
                    throw new Error('Post not found')
                }
            }catch(err) {
                throw new Error(err)
            }
        }
    },
    Mutation: {
        createPost: async (_, {body}, context) => {

            const user = checkAuthUser(context)

            if(body.trim() === ''){
                throw new UserInputError('Post must not be empty!', {
                    error: {
                        error: 'Post must not be empty, type something to share it with people.'
                    }
                })
            }

            const newPost = await new Post({
                body,
                user:user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save()

            return post

        },
        deletePost: async (_, {postId}, context) => {
            const user = checkAuthUser(context)

            const delPost = await Post.findById(postId)

            try{
                if(user.username === delPost.username){
                    await delPost.delete()
                    return 'Post deleted successfully!'
                }else {
                    throw new AuthenticationError('You don\'t have the permission to delete this post!')
                }
                // return delPost

            }catch (err) {
                throw new Error(err)
            }

        }
    }
}