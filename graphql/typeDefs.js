const {gql} = require('apollo-server')


module.exports = gql`
type Post{
    id: ID!
    username: String!
    body: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likesCount: Int!
    commentsCount: Int!
}

type Comment{
    id: ID!
    username: String!
    body: String!
    createdAt: String!
}

type Like{
    id: ID!
    username: String!
    createdAt: String!
}

type User{
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
}

input RegisterInput{
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
}

type Query{
    getPosts: [Post]!
    getPost(postID: ID!): Post
}

type Mutation{
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    createLike(postId: ID!): Post!
}
`
