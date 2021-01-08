// @ts-check
const { v4: uuidv4 } = require("uuid");

/**
 * @type {Character[]}
 */
let characters = [
  {
    id: 1,
    name: "character1",
    userId: 1,
  },
];

/**
 * @type {User[]}
 */
let users = [
    {
      id: 3,
      username: "user3",
      password: "user3",
    },
    {
      id: 2,
      username: "user2",
      password: "user2",
    },
    {
      id: 1,
      username: "user1",
      password: "user1",
    },
  ];

  module.exports.InMemory = function (db) {
    return {
      /**
       * @param {string} username
       * @param {string} password
       */
      createUser(username, password) {
        users.push({ id: users.length + 1, username, password });
      },
      /**
       * @param {number} id
       * @returns {User}
       */
      getUserById(id) {
        return users.find((u) => u.id == id);
      },
      /**
       *
       * @param {string} username
       */
      getUserByUsername(username) {
        return users.find((u) => u.username == username);
      },

    /**
     * @param {number} id
     * @returns {Character}
     */
    getCharacterById(id) {
      const character =  characters.find((c) => c.id == id);
      
      return {
        ...character,
      }
    },
    };
  };