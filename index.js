const fs = require("fs");
const http = require("isomorphic-git/http/node");
const git = require("isomorphic-git");
const globby = require("globby");
require("dotenv").config();
const { utcToZonedTime, format } = require("date-fns-tz");
const {
  fetchCountryNyt,
  fetchStateNyt,
  fetchCountyNyt,
} = require("./util/dataFetches");
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
      data: value.map((d) => {
        const { date, totalCases, totalDeaths, newCases, newDeaths } = d;
        return { date, totalCases, totalDeaths, newCases, newDeaths };
      }),
    };
    const json = JSON.stringify(entry);
    fs.writeFileSync(`./completed/counties/${key}.json`, json);
  });
};

const writeStateFiles = async () => {
  const stateData = await fetchStateNyt();
  for ([key, value] of stateData.entries()) {
    const abbreviated = value.map((entry) => {
      const { state, fips, ...rest } = entry; //ignore state and fips
      return rest;
    });
    const json = JSON.stringify(abbreviated);
    fs.writeFileSync(`./completed/states/${key}.json`, json);
  }
};

const writeCountryFile = async () => {
  const countryData = await fetchCountryNyt();
  const json = JSON.stringify(countryData);
  fs.writeFileSync("./completed/country.json", json);
};

const writeFiles = () => {
  writeCountyFiles();
  writeStateFiles();
  writeCountryFile();
  console.log("files written");
};

const getDate = () => {
  const timeZone = "America/New_York";
  const zonedDate = utcToZonedTime(new Date(), timeZone);
  const pattern = "yyyy-MM-dd hh:mm:ss a z";
  const outputDate = format(zonedDate, pattern, { timeZone });
  return outputDate;
};

const writeGithub = async () => {
  const dir = __dirname;

  //adds all files
  const paths = await globby(["./**", "./**/.*"], { gitignore: true });
  for (const filepath of paths) {
    await git.add({ fs, dir, filepath });
  }

  //commits files
  await git.commit({
    fs,
    dir,
    author: {
      name: process.env.NAME,
      email: process.env.EMAIL,
    },
    message: `Committed data files ${getDate()}`,
  });

  //pushes files to Github
  await git.push({
    fs,
    http,
    dir,
    onAuth: () => ({
      username: process.env.GITHUB_TOKEN,
    }),
  });

  console.log("pushed files to Github");
};

//run program
writeFiles();
writeGithub();
