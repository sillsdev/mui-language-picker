import { LangTag } from './model';

export type DisplayName = (curName: string, tag: LangTag | undefined) => string;

export const getDisplayName = (
  curName: string,
  tag: LangTag | undefined,
  displayName?: DisplayName
) => {
  if (displayName) return displayName(curName, tag);
  let tagName = curName;
  if (tag?.localname && tag.localname.toLowerCase() !== curName.toLowerCase())
    tagName = `${tag.localname} / ${curName}`;
  return tagName;
};
