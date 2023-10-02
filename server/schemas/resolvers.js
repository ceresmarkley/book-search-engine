const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // async getSingleUser({ user = null, params }, res) {/*...*/}
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (_, __, context) => {
      if (!context.user) throw AuthenticationError;
      return User.findOne({ _id: context.user._id }).populate('savedBooks');
    },
  },

  Mutation: {
    // async login({ body }, res) { /*...*/ }
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    // async createUser({ body }, res) { /*...*/ }
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // async saveBook({ user, body }, res) { /*...*/ }
    saveBook: async (_, { input }, context) => {
      // if no user object, throw authentication error
      if (!context.user) throw AuthenticationError;
      return await User.findByIdAndUpdate(
        // find user by id
        context.user._id,
        // push the book to the savedBooks array
        { $addToSet: { savedBooks: input } },
        // new: true returns the updated object
        { new: true, runValidators: true }
      );
    },

    // async deleteBook({ user, params }, res) { /*...*/ }
    // Make it so a logged in user can only remove a skill from their own profile
    removeBook: async (_, { bookId }, context) => {
      // if no user object, throw authentication error
      if (!context.user) throw AuthenticationError;
      return await User.findByIdAndUpdate(
        // find the user by their ID
        context.user._id,
        // remove the book from the savedBooks array
        { $pull: { savedBooks: { bookId } } },
        // new: true returns the updated object
        { new: true }
      );
    },
  },
};

module.exports = resolvers;