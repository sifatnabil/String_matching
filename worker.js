const { default: axios } = require("axios");
const { parentPort, workerData } = require("worker_threads");
const { api_url, api_cookie } = require("./config");
const fs = require("fs");

const number = workerData.number;
const timeOut = 6 * 60 * 1000;

const options = {
  headers: {
    "Content-Type": "application/json",
    Cookie: api_cookie,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
  },

  timeout: timeOut,
};

const url = api_url + number;

const data = {
  address: "",
  city: "",
  codbases: ["WBE", "WDE", "WIT", "WUK", "WNL", "WFR", "WES"],
  duplicates: false,
  externalIdentifier: "",
  firstName: workerData.firstname,
  individualEid: "",
  isInContract: false,
  lastName: workerData.lastname,
  onekeyId: "",
  phonetic: false,
  postCode: "",
  specialties: [],
};

const runQuery = async () => {
  await axios
    .post(url, data, options)
    .then((response) => {
      console.log("Done for Page: " + number);
      parentPort.postMessage(response.data.results);
    })
    .catch((err) => {
      console.log("An error occured for Page: " + number);
      parentPort.postMessage([]);
    });
};

runQuery();

// console.log("Page Done: " + number);
