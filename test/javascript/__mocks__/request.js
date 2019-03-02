const articles = {
  0: {title: 'Article 1', textContents: []},
  1: {title: 'Article 2', textContents: []},
};

export default function request(url) {
  return new Promise((resolve, reject) => {
    const userID = parseInt(url.substr('/users/'.length), 10);
    process.nextTick(() =>
      users[userID]
        ? resolve(users[userID])
        : reject({
            error: 'User with ' + userID + ' not found.',
          }),
    );
  });
}
