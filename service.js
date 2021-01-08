// @ts-check
const { v4: uuidv4 } = require("uuid");

function UnauthorizedException(message) {
    this.message = message;
    this.name = "UnauthorizedException";
  }
  
  function InvalidArgumentException(message) {
    this.message = message;
    this.name = "InvalidArgumentException";
  }
  
  function UsersService(repo) {
    return {
      /**
       * @param {string} username
       * @param {string} password
       * @returns {User | null}
       */
      login(username, password) {
        const user = repo.getUserByUsername(username);
        // TODO: Implement password hashing
        if (user.password === password) {
          return user;
        }
  
        return null;
      },
      /**
       * @param {string} username
       * @param {string} password
       */
      registerUser(username, password) {
        repo.createUser(username, password);
      },
    };
  }

  function CharacterService(repo) {
    return {
      /**
      * @param {number} userId
      */
      getUsersCharacter(userId) {
      return repo.getUsersCharacter(userId);
      },
    };
  }

  module.exports = {
    UsersService,
    CharacterService,
    UnauthorizedException,
    InvalidArgumentException,
  };  