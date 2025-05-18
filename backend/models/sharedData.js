// sharedData.js
// Shared in-memory storage used by both coupleController and listController

const coupleLists = {};      // coupleId -> [items]
const userCoupleMap = {};    // userEmail -> coupleId

module.exports = {
  coupleLists,
  userCoupleMap
};
