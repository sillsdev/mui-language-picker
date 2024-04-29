import jsonData from './data/langtags.json';
import { IFamilies, LangTag } from './langPicker/types';
import tagIndexData from './data/tagIndex';
import tokenData from './data/langtagsIndex';
import fontData from './data/scriptFontIndex';
import codeScriptsData from './data/codeScripts';
import scriptNameData from './data/scriptName';
import familiesData from './data/families.json';
import { bcp47Match } from './bcp47';
import rtlScripts from './data/rtlScripts';

export const langTags = jsonData as LangTag[];
langTags.push({
  full: 'qaa',
  iso639_3: 'qaa',
  localname: 'Unknown',
  name: 'Unknown',
  regionname: 'anywhere',
  script: 'Latn',
  sldr: false,
  tag: 'qaa',
});

const tagIndex = new Map<string, number>(tagIndexData as [string, number][]);
export const hasExact = (tag: string) => tagIndex.has(tag.toLowerCase());
export const getExact = (tag: string) => {
  const index = tagIndex.get(tag.toLowerCase());
  if (!index) return undefined;
  return langTags[index];
};

const tokenIndex = new Map(tokenData as [string, number[]][]);
export const hasPart = (tag: string) =>
  tokenIndex.has(tag.slice(0, 2).toLowerCase());
export const getPart = (tag: string, limit?: number, start?: number) => {
  let indexes = tokenIndex.get(tag.slice(0, 2).toLowerCase());
  if (!indexes) return undefined;
  if (start) {
    const find = indexes.indexOf(start);
    if (find !== -1) indexes = indexes.slice(find);
  }
  let count = 0;
  const result: LangTag[] = [];
  for (const index of indexes) {
    if (langTags[index]?.tag) {
      if (limit && count > limit) return { result, index };
      const element = langTags[index];
      const re = new RegExp(tag, 'i');
      if (re.test(JSON.stringify(element))) {
        result.push(langTags[index]);
        count++;
      }
    }
  }
  return { result, index: -1 };
};

const scriptMap = new Map<string, string[]>(
  codeScriptsData as [string, string[]][]
);
export const getScripts = (code: string) => scriptMap.get(code) ?? [];

export const scriptName = new Map<string, string>(
  scriptNameData as [string, string][]
);

export const fontMap = new Map(fontData as [string, string][]);

const families = familiesData as IFamilies;
export const displayFamily = (familyId: string) =>
  families[familyId]?.family ?? familyId;

export const getFamily = (familyId: string) => families[familyId];

export const getLangTag = (tag: string) => {
  if (!tag) return undefined;
  // put exact code match at the top of the list
  if (hasExact(tag)) {
    const langTag = getExact(tag);
    if (langTag) return langTag;
  }
  // check for a short tag match
  if (bcp47Match(tag)) {
    let lastDash = tag.lastIndexOf('-');
    while (lastDash > 0) {
      const shortTag = tag.slice(0, lastDash);
      if (hasExact(shortTag)) {
        const langTag = getExact(shortTag);
        if (langTag) {
          return langTag;
        }
      } else {
        lastDash = shortTag.lastIndexOf('-');
      }
    }
  }
};

export const getRtl = (tag: string) => {
  if (!tag || tag.indexOf('fonipa') !== -1) return false;
  const langTag = getLangTag(tag);
  if (langTag) return rtlScripts.includes(langTag.script);
  return false;
};
