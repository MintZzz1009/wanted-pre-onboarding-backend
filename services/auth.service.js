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

  signIn = async (email, password) => {
    try {
      return await this.userRepository.findUser(email, password);
    } catch (error) {
      throw error;
    }
  };

  signOut = async (email, password) => {};
}

module.exports = AuthService;
