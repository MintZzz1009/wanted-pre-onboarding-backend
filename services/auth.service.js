const UserRepository = require('../repositories/users.repository');
const Token = require('../middleware/token.js');
const { User } = require('../models');
const redisClient = require('../redis');

class AuthService {
  userRepository = new UserRepository(User);
  token = new Token();

  signUp = async (email, password) => {
    try {
      return await this.userRepository.createNewUser(email, password);
    } catch (error) {
      throw error;
    }
  };

  signIn = async (email) => {
    try {
      const { id } = await this.userRepository.findUser(email);
      const { accessToken, refreshToken } = this.token.generateToken(id);

      await redisClient.set(String(id), refreshToken);
      // await this.userRepository.saveRefreshToken(id, refreshToken);
      return accessToken;
    } catch (error) {
      throw error;
    }
  };

  clearRefreshToken = async (id) => {
    try {
      return await this.userRepository.clearRefreshToken(id);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AuthService;
