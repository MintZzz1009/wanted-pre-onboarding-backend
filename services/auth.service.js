const UserRepository = require('../repositories/users.repository');
const { User } = require('../models');

class AuthService {
  userRepository = new UserRepository(User);

  signUp = async (req, res) => {};

  signIn = async (req, res) => {};

  signOut = async (req, res) => {};
}

module.exports = AuthService;
