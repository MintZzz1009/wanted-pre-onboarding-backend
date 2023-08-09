const UserRepository = require('../repositories/users.repository');
const TokenMiddleware = require('../middleware/token.js');
const { User } = require('../models');

class AuthService {
  userRepository = new UserRepository(User);
  tokenMiddleware = new TokenMiddleware();

  signUp = async (email, password) => {
    try {
      return await this.userRepository.createNewUser(email, password);
    } catch (error) {
      throw error;
    }
  };

  signIn = async (email, password) => {
    try {
      const userInfo = await this.userRepository.findUser(email, password);
      return this.tokenMiddleware.generateToken(userInfo.id);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AuthService;
