const fs = require('fs');
const { fetchCountryNyt, fetchStateNyt, fetchCountyNyt } = require('./util/dataFetches');
const stateDict = require('./util/name_fips_pop.json');
const { greatest } = require('d3-array');
const statesLowerCased = require( './util/states_lower_case.json');

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

//figure out how to write u.s. state files

const writeStateFiles = async () => {
  const stateData = await fetchStateNyt();
  stateData.forEach((value, key) => {
    // console.log(value)
    // const entry = {
    //   state: value[0].state,
    //   fips: value[0].fips,
    //   data: value.map(d => {
    //     const { date, totalCases, totalDeaths, newCases, newDeaths } = d;
    //     return { date, totalCases, totalDeaths, newCases, newDeaths };
    //   })
    // }
    // const json = JSON.stringify(entry);
    // fs.writeFileSync(`./completed/states/${statesLowerCased[entry.state]}.json`, json);
    console.log(key)
  })
}

//writeCountyFiles();
writeStateFiles();
