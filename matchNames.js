const fuzzball = require("fuzzball");

module.exports = async (responses, actualName, nameWithTitle) => {
  let maxMatchedName = "";
  let maxMatchedNameRatio = 0;
  let onekeyId = 0;
  let workplace = [];

  for (const pages of responses) {
    for (const data of pages) {
      const fullname = data.firstName + " " + data.lastName;
      const matchRatio = fuzzball.token_sort_ratio(fullname, actualName);
      if (matchRatio > maxMatchedNameRatio) {
        maxMatchedNameRatio = matchRatio;
        maxMatchedName = fullname;
        onekeyId = data.individualEid;
        workplace = data.workplaces;
      }
    }
  }

  const res = {
    Name: nameWithTitle,
    "Max Matched Name": maxMatchedName,
    "Max Match ratio": maxMatchedNameRatio,
    OneKeyId: onekeyId,
    Workplaces: workplace,
  };

  return res;
};
