import React from 'react';
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
