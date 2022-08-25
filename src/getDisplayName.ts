import { LangTag } from './model';

export type DisplayName = (curName: string, tag: LangTag | undefined) => string;

export const getDisplayName = (
  curName: string,
  tag: LangTag | undefined,
  displayName?: DisplayName
) => {
  // If user setup a custom language name
  if (tag && curName !== tag.name) return curName;
  // if caller provided a custom name formatter
  if (displayName) return displayName(curName, tag);
  // By default show the local name if present and the name
  let tagName = curName;
  if (tag?.localname && tag.localname.toLowerCase() !== curName.toLowerCase())
    tagName = `${tag.localname} / ${curName}`;
  return tagName;
};
