const readXlsxFile = require("read-excel-file/node");

const schema = {
  Name: {
    prop: "name",
    type: String,
  },
  Email: {
    prop: "email",
    type: String,
  },
  "Company/HCP": {
    prop: "hcp",
    type: String,
  },
  Notes: {
    prop: "notes",
    type: String,
  },
};

module.exports = async (filename) => {
  return await readXlsxFile(filename, {
    schema,
  });
};
