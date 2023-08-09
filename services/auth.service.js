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
      const { id } = await this.userRepository.findUser(email, password);
      const { accessToken, refreshToken } =
        this.tokenMiddleware.generateToken(id);
      await this.userRepository.saveRefreshToken(id, refreshToken);
      return accessToken;
    } catch (error) {
      throw error;
    }
  };

  clearRefreshToken = async (id) => {
    try {
      await this.userRepository.clearRefreshToken(id);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AuthService;
