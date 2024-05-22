/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const writeFile = require('write');

const getJsonData = (name, url) => {
  axios
    .get(`https://raw.githubusercontent.com/silnrsi/${url}/${name}.json`)
    .then((response) => {
      const jsonData = JSON.stringify(response.data, null, 2);
      writeFile.sync(__dirname + `/../data/${name}.json`, jsonData);
      console.log(`${name}.json:`, jsonData.length);
    })
    .catch((error) => {
      console.error(`unable to get ${name}.json`, error);
    });
};

getJsonData('langtags', 'langtags/master/pub');
getJsonData('families', 'fonts/main');
