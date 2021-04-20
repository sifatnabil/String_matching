const readData = require("./readExcel");
const excelFileName = "./not_found.xlsx";
const combinations = require("./generateCombinations");
const apiRequest = require("./cdpRequest");
const sleep = require("util").promisify(setTimeout);
const { Worker, workerData } = require("worker_threads");
const path = require("path");
const matchNames = require("./matchNames");

const workerPath = path.resolve("./worker.js");
const batchSize = 22;
const intervalTimeSeconds = 3;

const sendRequests = async (pageStart, totalPages, firstname, lastname) => {
  let arraySize = 0;
  if (pageStart + batchSize < totalPages) arraySize = batchSize;
  else arraySize = totalPages - pageStart + 1;

  const numbers = [...new Array(arraySize)].map((_, i) => pageStart + i);

  const promises = numbers.map(async (number, ind) => {
    await sleep(2000 * ind);
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: {
          number: number,
          firstname: firstname,
          lastname: lastname,
        },
      });
      worker.once("message", resolve);
      worker.on("eror", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  });

  const res = await Promise.all(promises);
  return res;
};

const readNames = async (excelFileName) => {
  const result = await readData(excelFileName);
  const details = [];
  details.push(...result.rows);

  for (let i = 0; i < details.length; i++) {
    let actualName = "";
    if (details[i].name.startsWith("Prof Dr")) {
      actualName = details[i].name.slice(8, details[i].name.length);
    } else if (details[i].name.startsWith("Prof")) {
      actualName = details[i].name.slice(5, details[i].name.length);
    } else if (details[i].name.startsWith("Dr")) {
      actualName = details[i].name.slice(3, details[i].name.length);
    } else actualName = details[i].name;

    const nameWords = actualName.split(" ");
    const nameCombinations = combinations(nameWords);

    console.log(`Matching for name ${details[i].name}`);
    for (const option of nameCombinations) {
      const firstName = option.firstname;
      const lastName = option.lastname;
      await sleep(2000);
      const totalNumberOfResults = await apiRequest(firstName, lastName);
      console.log(
        `Firstname: ${firstName}, Lastname: ${lastName} and No. of Results: ${totalNumberOfResults}`
      );
      const pages = Math.ceil(totalNumberOfResults / 100);

      for (let j = 1; j <= pages; ) {
        console.log(`Batch starting page: ${j}`);
        const responses = await sendRequests(j, pages, firstName, lastName);
        const matchResult = await matchNames(
          responses,
          actualName,
          details[i].name
        );
        console.log("Done with the batch\n");
        console.log(matchResult);
        await sleep(intervalTimeSeconds * 1000);
        j += batchSize;
        break;
      }
      break;
    }
    break;

    // console.log(nameCombinations);
  }
};

readNames(excelFileName);
