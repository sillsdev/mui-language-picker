const badChar = " (),.:/!?_'`0123456789";
export const hasBadChar = (s: string) => {
  for (const c of s.split('')) {
    if (badChar.indexOf(c) !== -1) return true;
  }
  return false;
};
export const woBadChar = (s: string | undefined) => {
  if (!s) return '';
  let result = '';
  for (const c of s.split('')) {
    if (badChar.indexOf(c) === -1) result += c;
  }
  return result;
};
