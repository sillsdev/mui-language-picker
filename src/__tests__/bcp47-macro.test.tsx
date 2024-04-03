/* eslint-disable @typescript-eslint/require-await */
import { bcp47Match, bcp47Parse, bcp47Find } from '../bcp47';
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

test('test zh-min-bei', async () => {
  expect(bcp47Match('zh-min-bei')).toBeTruthy();
});

test('find zh-min-bei', async () => {
  const code = bcp47Find('zh-min-bei');
  expect(Array.isArray(code)).toBeTruthy();
  expect(Array.isArray(code) && code.length).toEqual(2);
});

test('parse zh-min-bei', async () => {
  expect(bcp47Parse('zh-min-bei')).toEqual({
    language: 'zh-min-bei',
    extlang: 'bei',
    script: null,
    region: null,
    variant: null,
    extension: null,
    privateUse: [],
    irregular: null,
  });
});
