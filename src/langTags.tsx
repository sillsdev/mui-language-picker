import jsonData from './data/langtags.json';
import { LangTag } from './langPicker/types';

export let langTags = jsonData as LangTag[];
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
