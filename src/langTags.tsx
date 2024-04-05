import jsonData from './data/langtags.json';
import { LangTag } from './langPicker/types';
import tagIndexData from './data/tagIndex';
import tokenData from './data/langtagsIndex';

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
  const index = tagIndex.get(tag.toLowerCase())
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
}
