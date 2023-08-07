const UserRepository = require('../repositories/users.repository');
const { User } = require('../models');

class AuthService {
  userRepository = new UserRepository(User);

  signUp = async (email, password) => {
    try {
      return await this.userRepository.createNewUser(email, password);
    } catch (error) {
      throw error;
    }
  };

  signIn = async (req, res) => {};

  signOut = async (req, res) => {};
}

module.exports = AuthService;
