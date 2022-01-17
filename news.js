const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("9f56611f4d7646d1b3e557b46575652a");
// All options are optional

const getEverything = async (options) => {
  return newsapi.v2.topHeadlines(options);
};



module.exports = {
  getEverything,
};
