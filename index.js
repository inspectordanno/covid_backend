const { fetchCountryNyt, fetchStateNyt, fetchCountyNyt } = require('./util/dataFetches');

fetchCountyNyt().then((res) => console.log(res))