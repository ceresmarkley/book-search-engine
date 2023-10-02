const { gql } = require('graphql-tag');

// Define the GraphQL type definitions
const typeDefs = gql`
  type Book {
    bookId: String!
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  input BookData {
    bookId: String!
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }
  type Auth {
    token: ID!
    user: User!
  }

  type Query {
    users: [User]!
    user(username: String!): User
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookData!): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;