/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const collectScripts = (langTags) => {
  const lists = {};
  langTags.forEach((lt) => {
    if (lt.tag && !/^_/.test(lt.tag)) {
      const lgTag = lt.tag.split('-')[0];
      if (lists.hasOwnProperty(lgTag)) {
        if (!lists[lgTag].includes(lt.script)) lists[lgTag].push(lt.script);
      } else {
        lists[lgTag] = [lt.script];
      }
    }
  });
  return lists;
};

const addFontToList = (list, s) => {
  if (s.trim() !== '') list.push(s);
};

const makeFontMap = (data) => {
  const fontMap = {};
  data.split('\n').forEach((line, i) => {
    if (i !== 0) {
      const fields = line.split('\t');
      const code = fields[0].trim();
      const regions = fields[8]
        .trim()
        .split(',')
        .map((v) => v.trim());
      const fonts = [];
      addFontToList(fonts, fields[11]);
      addFontToList(fonts, fields[12]);
      addFontToList(fonts, fields[13]);
      addFontToList(fonts, fields[14]);
      addFontToList(fonts, fields[15]);
      addFontToList(fonts, fields[16]);
      addFontToList(fonts, fields[17]);
      if (fonts.length !== 0) {
        if (regions.length === 0) {
          if (fontMap.hasOwnProperty(code)) {
            console.log(
              'Warning: scripts.csv: ' +
                code +
                ' exists twice in table with no region.'
            );
          }
          fontMap[code] = fonts;
        } else {
          regions.forEach((r) => {
            const key = r.trim().length > 0 ? code + '-' + r : code;
            if (fontMap.hasOwnProperty(key)) {
              console.log(
                'Warning: scripts.csv: ' +
                  code +
                  ' with region ' +
                  r +
                  ' has multiple font definitions.'
              );
            }
            fontMap[key] = fonts;
          });
        }
      }
    }
  });
  return fontMap;
};

const getNames = (data) => {
  const names = {};
  data.split('\n').forEach((line, i) => {
    if (i !== 0) {
      const fields = line.split('\t');
      const code = fields[0].trim();
      const name = fields[2].trim();
      if (name !== '') names[code] = name;
    }
  });
  return names;
};

const fs = require('fs');
const writeFile = require('write');
const indexDir = __dirname + '/../index';
if (!fs.existsSync(indexDir)) fs.mkdirSync(indexDir);

const makeFolder = (name, typeName, data) => {
  const folder = indexDir + '/' + name;
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
  const firstChar = {};
  const keys = Object.keys(data);
  keys.forEach((k) => {
    const letter = k.slice(0, 1);
    if (!firstChar.hasOwnProperty(letter)) firstChar[letter] = true;
  });
  Object.keys(firstChar).forEach((letter) => {
    const letPart = {};
    keys.forEach((key) => {
      if (key.slice(0, 1) === letter) {
        if (name !== 'Scripts') letPart[key] = data[key].map((i) => i.index);
        else letPart[key] = data[key];
      }
    });
    const firstCode = letter.charCodeAt(0).toString();
    const header = `// This file is auto-generated. Modify the script that creates it.
import { ${typeName} } from '../../langPicker/types';

export const f${firstCode}: ${typeName} =  `;
    writeFile.sync(
      folder + '/' + firstCode + '.tsx',
      header + JSON.stringify(letPart, '', 2)
    );
  });
  let code =
    '// This file is auto-generated. Modify the script that creates it.\n';
  Object.keys(firstChar).forEach((letter) => {
    const firstCode = letter.charCodeAt(0).toString();
    code =
      code +
      'import { f' +
      firstCode +
      " } from './" +
      name +
      '/' +
      firstCode +
      "';\n";
  });
  code =
    code +
    `\nexport const has${name} = (key: string) => {
  if (!key || key.length === 0) return false;
  switch (key.slice(0,1).charCodeAt(0)) {
`;
  Object.keys(firstChar).forEach((letter) => {
    const firstCode = letter.charCodeAt(0).toString();
    code =
      code +
      '    case ' +
      firstCode +
      ': return f' +
      firstCode +
      '.hasOwnProperty(key);\n';
  });
  code =
    code +
    `    default: return false;
  }
}

export const get${name} = (key: string) => {
  if (!key || key.length === 0) return [];
  switch (key.slice(0,1).charCodeAt(0)) {
`;
  Object.keys(firstChar).forEach((letter) => {
    const firstCode = letter.charCodeAt(0).toString();
    code =
      code + '    case ' + firstCode + ': return f' + firstCode + '[key];\n';
  });
  code =
    code +
    `    default: return [];
  }
}
`;
  code =
    code +
    `\nexport const hasPart = (key: string) => {
if (!key || key.length === 0) return false;
switch (key.slice(0,1).charCodeAt(0)) {
`;
  Object.keys(firstChar).forEach((letter) => {
    const firstCode = letter.charCodeAt(0).toString();
    code = code + '    case ' + firstCode + ': return true;\n';
  });
  code =
    code +
    `    default: return false;
}
}

export const getPart = (key: string) => {
if (!key || key.length === 0) return [];
switch (key.slice(0,1).charCodeAt(0)) {
`;
  Object.keys(firstChar).forEach((letter) => {
    const firstCode = letter.charCodeAt(0).toString();
    code = code + '    case ' + firstCode + ': return f' + firstCode + ';\n';
  });
  code =
    code +
    `    default: return [];
}
}
`;
  writeFile.sync(indexDir + '/Lg' + name + '.tsx', code);
};

const json = fs.readFileSync(__dirname + '/../data/langtags.json', 'utf8');
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
const scripts = collectScripts(jsonData);
// These three lines prevent null values from ending up in the lists
scripts['_globalvar'] = [];
scripts['_phonvar'] = [];
scripts['_version'] = [];
makeFolder('Scripts', 'ScriptList', scripts);

const csvData = fs.readFileSync(__dirname + '/../data/scripts.csv', 'utf8');
const header1 = `// This file is auto-generated. Modify the script that creates it.
import { FontMap } from '../langPicker/types';

export const fontMap: FontMap =  `;
writeFile.sync(
  indexDir + '/LgFontMap.tsx',
  header1 + JSON.stringify(makeFontMap(csvData), '', 2)
);
const header2 = `// This file is auto-generated. Modify the script that creates it.
import { ScriptName } from '../langPicker/types';

export const scriptName: ScriptName =  `;
writeFile.sync(
  indexDir + '/LgScriptName.tsx',
  header2 + JSON.stringify(getNames(csvData), '', 2)
);
