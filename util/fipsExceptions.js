//localities with no fips code but are included in data

const fipsExceptions = {
  nyc: 'nyc', //new york city
  kc: 'kc', //kansas city, mi
  pr: 'pr', //puerto rico,
  guam: 'guam', //guam
  vi: 'vi', //virgin islands
  nmi: 'nmi' //northern mariana islandsoi
};

const fipsPop = {
  nyc: 8336817,
  kc: 495327,
  pr: 3193694,
  guam: 167294,
  vi: 107000,
  nmi: 51994
}

module.exports = fipsExceptions;