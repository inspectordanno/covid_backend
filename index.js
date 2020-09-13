const fs = require('fs');
const { fetchCountryNyt, fetchStateNyt, fetchCountyNyt } = require('./util/dataFetches');
// const stateDict = require('./util/name_fips_pop.json');
// const { greatest } = require('d3-array');

// *** Creates a dictionary lookup of counties for each state:

// const createDict = async () => {
//   const stateData = await fetchStateNyt();
//   const countyData = await fetchCountyNyt();

//   const stateDictCompleted = {};

//   for (const [stateName, counties] of Object.entries(stateDict)) {
//     stateDictCompleted[stateName] = {
//       mostPopulous: greatest(counties, d => d.pop_2019),
//       counties
//     }
//   }

//   const json = JSON.stringify(stateDictCompleted);

//   fs.writeFileSync('./completed/state_county_dict.json', json);
// }

// createDict();

const writeCountyFiles = async () => {
  const countyData = await fetchCountyNyt();
  countyData.forEach((value, key) => {
    const entry = {
      county: value[0].county,
      state: value[0].state,
      fips: value[0].fips,
      pop_2019: value[0].pop_2019,
      data: value.map(d => {
        const { date, totalCases, totalDeaths, newCases, newDeaths } = d;
        return { date, totalCases, totalDeaths, newCases, newDeaths };
      })
     }
    const json = JSON.stringify(entry);
    fs.writeFileSync(`./completed/counties/${key}.json`, json);
  })
}

const writeStateFiles = async () => {
  const stateData = await fetchStateNyt();
  for ([key, value] of stateData.entries()) {
    const abbreviated = value.map(entry => {
      const { state, fips, ...rest } = entry; //ignore state and fips
      return rest;
    })
    const json = JSON.stringify(abbreviated);
    fs.writeFileSync(`./completed/states/${key}.json`, json);
  }
}

const writeCountryFile = async () => {
  const countryData = await fetchCountryNyt();
  const json = JSON.stringify(countryData);
  fs.writeFileSync('./completed/country.json', json);
}

writeCountyFiles();
writeStateFiles();
writeCountryFile();