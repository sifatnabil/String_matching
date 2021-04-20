module.exports = (nameWords) => {
  const nameCombinations = [];
  nameCombinations.push({
    firstname: "",
    lastname: nameWords[nameWords.length - 1],
  });
  if (nameWords.length > 2) {
    nameCombinations.push({
      firstname: "",
      lastname:
        nameWords[nameWords.length - 2] + " " + nameWords[nameWords.length - 1],
    });

    // let constructedName = "";
    // for (let i = 0; i < nameWords.length - 1; i++) {
    //   constructedName += nameWords[i][0] + ".";
    // }
    // nameCombinations.push({
    //   firstname: constructedName,
    //   lastname: nameWords[nameWords.length - 1],
    // });
  } else {
    nameCombinations.push({
      firstname: nameWords[0],
      lastname: nameWords[1],
    });
  }

  return nameCombinations;
};
