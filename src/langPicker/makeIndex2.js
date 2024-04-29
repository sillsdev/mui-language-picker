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
// sorts the matches in order by what field they are in and just keeps the index
result.forEach((r) => {
  r[1].sort((a, b) => a.kn - b.kn);
  r[1] = r[1].map((e) => e.i);
});
const maxSet = new Set();
result.forEach((r) => {
  maxSet.add(r[1].length);
});
const maxes = Array.from(maxSet).sort((a, b) => a - b);
console.log('maxes:', maxes.slice(-40));
const header = `// This file is auto-generated. Modify the script that creates it.
export default `;
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

// scriptMap
const scriptMap = new Map();
const codeScripts = new Map();
jsonData.forEach((element, i) => {
  const code = element.tag.split('-')[0];
  const curScript = element.script;
  if (!codeScripts.has(code)) {
    codeScripts.set(code, [curScript]);
  } else {
    const scripts = codeScripts.get(code);
    if (!scripts?.includes(curScript)) {
      scripts.push(curScript);
    }
  }
  if (curScript) {
    if (!scriptMap.has(curScript)) {
      scriptMap.set(curScript, i);
    }
  }
});
const codeScriptResult = Array.from(codeScripts).sort((a, b) =>
  a[0].localeCompare(b[0])
);
writeFile.sync(
  __dirname + '/../data/codeScripts.ts',
  header + JSON.stringify(codeScriptResult)
);
const scriptResult = Array.from(scriptMap).sort((a, b) =>
  a[0].localeCompare(b[0])
);

const scriptName = new Map();
const getNames = (data) => {
  data.split('\n').forEach((line, i) => {
    if (i !== 0) {
      const fields = line.split('\t');
      const code = fields[0].trim();
      const name = fields[2].trim();
      if (name !== '') scriptName.set(code, name);
    }
  });
};

const csvData = readFileSync(__dirname + '/../data/scripts.csv', 'utf8');
getNames(csvData);
writeFile.sync(
  __dirname + '/../data/scriptName.ts',
  header + JSON.stringify(Array.from(scriptName), '', 2)
);

// collect font for each script
const scriptFontMap = new Map();

const finishScriptFont = () => {
  const scriptFontResult = Array.from(scriptFontMap).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  writeFile.sync(
    __dirname + '/../data/scriptFontIndex.ts',
    header + JSON.stringify(scriptFontResult)
  );
  console.log('script map:', scriptFontResult.length);
};

const axios = require('axios');

const nextScriptFont = (n) => {
  if (n >= scriptResult.length) {
    finishScriptFont();
    return;
  }
  const [s, i] = scriptResult[n];
  if (!scriptName.has(s)) {
    console.error(`script name missing: ${s}`);
  }
  const langTag = jsonData[i];
  const tag = langTag?.tag;
  if (tag)
    axios
      .get(`https://lff.api.languagetechnology.org/lang/${tag}`)
      .then((response) => {
        console.log('has result', tag);
        scriptFontMap.set(s, JSON.stringify(response.data));
        setTimeout(() => nextScriptFont(n + 1), 1000);
      })
      .catch((error) => {
        console.log(error.message);
        if (error.code === 'ECONNRESET') nextScriptFont(n);
      });
};

nextScriptFont(0);
