const UserRepository = require('../repositories/users.repository');
const Token = require('../middleware/token.js');
const { User } = require('../models');
const redisClient = require('../utils/redis');
const { TokenServiceError } = require('../utils/apiError');

class AuthService {
  userRepository = new UserRepository(User);
  token = new Token();

  signUp = async (email, password) =>
    await this.userRepository.createNewUser(email, password);

  signIn = async (email) => {
    const { id } = await this.userRepository.findUser(email);
    const { accessToken, refreshToken } = this.token.generateToken(id);
    await redisClient.set(String(id), refreshToken);
    // refreshToken을 redis가 아닌 DB에 저장할시
    // await this.userRepository.saveRefreshToken(id, refreshToken);
    return accessToken;
  };

  clearRefreshToken = async (id) => {
    if (redisClient.exists(String(id))) {
      await redisClient.del(String(id));
      return 'success';
    } else {
      return 'there is no refreshToken in redis';
    }
    // refreshToken을 redis가 아닌 DB에 저장할시
    // await this.userRepository.clearRefreshToken(id);
  };
}

module.exports = AuthService;
