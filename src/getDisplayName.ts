import { LangTag } from './model';

export type DisplayName = (curName: string, tag: LangTag | undefined) => string;

export const getDisplayName = (
  curName: string,
  tag: LangTag | undefined,
  displayName?: DisplayName
) => {
  // If user setup a custom language name
  if (tag && curName !== tag.name) return curName;
  // If caller provided a custom name formatter
  if (displayName) return displayName(curName, tag);
  // By default, show a local name (if present) and the name
  const localName = tag
    ? tag.localname || (tag.localnames?.length ? tag.localnames[0] : undefined)
    : undefined;
  return localName && localName.toLowerCase() !== curName.toLowerCase()
    ? `${localName} / ${curName}`
    : curName;
};
