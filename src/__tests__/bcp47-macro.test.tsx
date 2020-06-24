import '@testing-library/jest-dom/extend-expect';
import { langTags } from '../langTags';
import { bcp47Match, bcp47Parse, bcp47Find, bcp47Index } from '../bcp47';
import { LangTag } from '../model';

test('test zh-yue', async () => {
  expect(bcp47Match('zh-yue')).toBeTruthy();
});

test('find zh-yue', async () => {
  const code = bcp47Find('zh-yue');
  expect(Array.isArray(code)).toBeFalsy();
  expect((code as LangTag).full).toEqual('yue-Hant-HK');
});

test('parse zh-yue', async () => {
  expect(bcp47Parse('zh-yue')).toEqual({
    language: 'zh-yue',
    extlang: 'yue',
    script: null,
    region: null,
    variant: null,
    extension: null,
    privateUse: [],
    irregular: null,
  });
});
