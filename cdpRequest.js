const axios = require("axios");
const { api_url, api_cookie } = require("./config");

module.exports = async (firstname, lastname) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
      Cookie: api_cookie,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    },
  };

  const url = api_url;

  const data = {
    address: "",
    city: "",
    codbases: ["WDE", "WBE", "WNL", "WUK", "WES", "WFR", "WIT"],
    duplicates: false,
    externalIdentifier: "",
    firstName: firstname,
    individualEid: "",
    isInContract: false,
    lastName: lastname,
    onekeyId: "",
    phonetic: false,
    postCode: "",
    specialties: [],
  };

  let totalResults = 0;

  await axios
    .post(url, data, options)
    .then((response) => (totalResults = response.data.totalNumberOfResults))
    .catch((err) => console.log(err));

  return totalResults;
};
