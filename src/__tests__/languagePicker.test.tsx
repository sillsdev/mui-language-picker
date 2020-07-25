import React from 'react';
import keycode from 'keycode';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { LanguagePicker, languagePickerStrings_en } from '..';

afterEach(cleanup);

const MyComponent: React.FC = (props: any) => {
  const [bcp47, setBcp47] = React.useState('und');
  const [lgName, setLgName] = React.useState('');
  const [fontName, setFontName] = React.useState('');

  return (
    <LanguagePicker
      value={bcp47}
      setCode={setBcp47}
      name={lgName}
      setName={setLgName}
      font={fontName}
      setFont={setFontName}
      t={languagePickerStrings_en}
    />
  );
};

test('can render Language Picker snapshot', async () => {
  const { getByText, container } = render(<MyComponent />);
  await waitForElement(() => getByText(/^Language$/i));
  expect(container).toMatchSnapshot();
});

test('enter e', async () => {
  const { getByText, container } = render(<MyComponent />);
  await waitForElement(() => getByText(/^Language$/i));
  fireEvent.keyDown(getByText(/^Language/i).nextSibling?.firstChild as any, {
    key: 'E',
    code: 'KeyE',
  });
  await waitForElement(() => getByText(/^Choose Language Details$/i));
  expect(container.parentElement).toMatchSnapshot();
});

test('enter en contains en-001 entry', async () => {
  const { getByText, getAllByText, container } = render(<MyComponent />);
  await waitForElement(() => getByText(/^Language$/i));
  fireEvent.keyDown(getByText(/^Language/i).nextSibling?.firstChild as any, {
    key: 'E',
    code: 'KeyE',
  });
  await waitForElement(() => getByText(/^Choose Language Details$/i));
  fireEvent.change(
    getAllByText(/Find a language by name, code, or country/i)[0].nextSibling
      ?.firstChild as any,
    { target: { value: 'en' } }
  );
  await waitForElement(() => getByText(/^en-001$/i));
  expect(
    getByText(/^en-001$/i).parentElement?.parentElement?.parentElement
      ?.parentElement
  ).toMatchSnapshot();
});
