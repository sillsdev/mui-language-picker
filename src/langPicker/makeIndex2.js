/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const readFileSync = require('fs').readFileSync;
const writeFile = require('write');
const json = readFileSync(__dirname + '/../data/langtags.json', 'utf8');
const jsonData = JSON.parse(json);
console.log('json data:', jsonData.length);
jsonData.push({
  full: 'qaa',
  iso639_3: 'qaa',
  localname: 'Unknown',
  name: 'Unknown',
  regionname: 'anywhere',
  script: 'Latn',
  sldr: false,
  tag: 'qaa',
});
const jsonKeys = new Set();
jsonData.forEach((element) => {
  Object.keys(element).forEach((key) => {
    jsonKeys.add(key);
  });
});
console.log('json keys:', Array.from(jsonKeys).sort());
const targetKeys = [
  'tag',
  'iso639_3',
  'tags',
  'full',
  'name',
  'names',
  'localname',
  'localnames',
  'regionname',
  'regions',
  'iana',
  'variants',
  'macrolang',
];
const elementTokens = new Map();
jsonData.forEach((element, i) => {
  const keyTokens = new Map();
  targetKeys.forEach((key, kn) => {
    if (element[key]) {
      let value;
      try {
        value = JSON.parse(element[key]);
      } catch (e) {
        value = element[key];
      }
      if (!Array.isArray(value)) {
        value = [value];
      }
      value.forEach((v) => {
        const token = v.slice(0, 2).toLowerCase();
        if (!keyTokens.has(token)) {
          keyTokens.set(token, { kn, i });
        }
      });
    }
  });
  Array.from(keyTokens.keys()).forEach((k) => {
    if (elementTokens.has(k)) {
      elementTokens.set(k, elementTokens.get(k).concat(keyTokens.get(k)));
    } else {
      elementTokens.set(k, [keyTokens.get(k)]);
    }
  });
});
const result = Array.from(elementTokens).sort((a, b) =>
  a[0].localeCompare(b[0])
);
// sorts the matches in order by what field they are in and just keepts the index
result.forEach((r) => {
  r[1].sort((a, b) => a.kn - b.kn);
  r[1] = r[1].map((e) => e.i);
});
// for (const idx of Array.from(Array(20)).map((_, i) => i)) {
//   console.log(result[idx]);
// }
const maxSet = new Set();
result.forEach((r) => {
  maxSet.add(r[1].length);
});
const maxes = Array.from(maxSet).sort((a, b) => a - b);
console.log('maxes:', maxes.slice(-40));
const header = `export default `;
writeFile.sync(
  __dirname + '/../data/langtagsIndex.ts',
  header + JSON.stringify(result)
);
console.log(result.length);

const tagMap = new Map();
jsonData.forEach((element, i) => {
  ['tag'].forEach((key) => {
    if (element[key]) {
      let value;
      try {
        value = JSON.parse(element[key]);
      } catch (e) {
        value = element[key];
      }
      if (!Array.isArray(value)) {
        value = [value];
      }
      value.forEach((v) => {
        const lcv = v.toLowerCase();
        if (tagMap.has(lcv)) {
          console.log('duplicate tag:', v);
        }
        tagMap.set(lcv, i);
      });
    }
  });
});
const tagResult = Array.from(tagMap).sort((a, b) => a[0].localeCompare(b[0]));
writeFile.sync(
  __dirname + '/../data/tagIndex.ts',
  header + JSON.stringify(tagResult)
);
console.log('tag map:', tagResult.length);
