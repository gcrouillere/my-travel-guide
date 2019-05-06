const getHashedPasswordFromDB = jest.fn(() => Promise.resolve({}))

module.exports = {
  getHashedPasswordFromDB
}
