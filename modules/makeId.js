function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function makeId() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  const length = getRandomArbitrary(5, 8)
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = makeId;