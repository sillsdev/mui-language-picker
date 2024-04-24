/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import LanguageChoice from '../LanguageChoice';
import { LangTag, ScriptName, ILanguagePickerStrings } from '../model';
import { languagePickerStrings_en } from '../model';

// eslint-disable-next-line no-var
var mockLangTags: LangTag[] = [
  {
    full: 'de-Latn-DE',
    name: 'German, Standard',
    region: 'DE',
    regionname: 'Germany',
    script: 'Latn',
    sldr: true,
    tag: 'de',
  },
  {
    full: 'en-Latn-US',
    name: 'English',
    region: 'US',
    regionname: 'United States',
    script: 'Latn',
    sldr: true,
    tag: 'en',
  },
  {
    full: 'fr-Latn-FR',
    name: 'French',
    region: 'FR',
    regionname: 'France',
    script: 'Latn',
    sldr: true,
    tag: 'fr',
  },
  {
    full: 'seh-Latn-MZ',
    name: 'Sena',
    region: 'MZ',
    regionname: 'Mozambique',
    script: 'Latn',
    sldr: true,
    tag: 'seh',
  },
];

describe('LanguageChoice', () => {
  beforeEach(cleanup);

  it('should render', () => {
    const props = {
      list: [],
      choose: (tag: LangTag) => {},
      t: {} as ILanguagePickerStrings,
    };
    const { container } = render(<LanguageChoice {...props} />);
    expect(container).not.toBe(null);
  });

  it('should render with secondary', () => {
    const props = {
      list: [],
      choose: (tag: LangTag) => {},
      t: {} as ILanguagePickerStrings,
      secondary: true,
    };
    const { container } = render(<LanguageChoice {...props} />);
    expect(container).not.toBe(null);
  });

  it('should render with displayName', () => {
    const props = {
      list: [],
      choose: (tag: LangTag) => {},
      t: {} as ILanguagePickerStrings,
      displayName: (curName: string, tag: LangTag | undefined) => '',
    };
    const { container } = render(<LanguageChoice {...props} />);
    expect(container).not.toBe(null);
  });

  it('should render with displayName and secondary', () => {
    const props = {
      list: [],
      choose: (tag: LangTag) => {},
      t: {} as ILanguagePickerStrings,
      displayName: (curName: string, tag: LangTag | undefined) => '',
      secondary: true,
    };
    const { container } = render(<LanguageChoice {...props} />);
    expect(container).not.toBe(null);
  });

  it('should render with displayName and secondary and langTags', () => {
    const props = {
      list: [],
      choose: (tag: LangTag) => {},
      t: {} as ILanguagePickerStrings,
      displayName: (curName: string, tag: LangTag | undefined) => '',
      secondary: true,
    };
    const { container } = render(<LanguageChoice {...props} />);
    expect(container).not.toBe(null);
  });

  it('should render with displayName and secondary and langTags and scriptName', () => {
    const props = {
      list: [],
      choose: (tag: LangTag) => {},
      t: {} as ILanguagePickerStrings,
      displayName: (curName: string, tag: LangTag | undefined) => '',
      secondary: true,
    };
    const { container } = render(<LanguageChoice {...props} />);
    expect(container).not.toBe(null);
  });

  it('should render language codes, names, and regions', () => {
    const props = {
      list: [0, 1, 2, 3].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
      displayName: (curName: string, tag: LangTag | undefined) => curName,
      secondary: true,
    };
    render(<LanguageChoice {...props} />);
    expect(screen.getAllByText('de')).toHaveLength(1);
    expect(screen.getAllByText('en')).toHaveLength(1);
    expect(screen.getAllByText('fr')).toHaveLength(1);
    expect(screen.getAllByText('seh')).toHaveLength(1);
    expect(screen.getAllByText('German, Standard')).toHaveLength(1);
    expect(screen.getAllByText('English')).toHaveLength(1);
    expect(screen.getAllByText('French')).toHaveLength(1);
    expect(screen.getAllByText('Sena')).toHaveLength(1);
    expect(screen.getAllByText('A Language of Germany.')).toHaveLength(1);
    expect(screen.getAllByText('A Language of United States.')).toHaveLength(1);
    expect(screen.getAllByText('A Language of France.')).toHaveLength(1);
    expect(screen.getAllByText('A Language of Mozambique.')).toHaveLength(1);
  });

  it('should render without displayName', () => {
    const props = {
      list: [1].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
    };
    render(<LanguageChoice {...props} />);
    expect(screen.getAllByText('English')).toHaveLength(1);
  });

  it('should render with custom displayName', () => {
    const props = {
      list: [0, 1, 2, 3].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
      displayName: (curName: string) => curName.slice(0, 4),
    };
    render(<LanguageChoice {...props} />);
    expect(screen.getAllByText('Engl')).toHaveLength(1);
  });

  it('should not render regions when secondary is false', () => {
    const props = {
      list: [1, 3].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
      displayName: (curName: string, tag: LangTag | undefined) => curName,
      secondary: false,
    };
    render(<LanguageChoice {...props} />);
    expect(screen.queryAllByText('de')).toHaveLength(0);
    expect(screen.getAllByText('en')).toHaveLength(1);
    expect(screen.queryAllByText('fr')).toHaveLength(0);
    expect(screen.getAllByText('seh')).toHaveLength(1);
    expect(screen.queryAllByText('German, Standard')).toHaveLength(0);
    expect(screen.getAllByText('English')).toHaveLength(1);
    expect(screen.queryAllByText('French')).toHaveLength(0);
    expect(screen.getAllByText('Sena')).toHaveLength(1);
    expect(screen.queryAllByText('A Language of Germany.')).toHaveLength(0);
    expect(screen.queryAllByText('A Language of United States.')).toHaveLength(
      0
    );
    expect(screen.queryAllByText('A Language of France.')).toHaveLength(0);
    expect(screen.queryAllByText('A Language of Mozambique.')).toHaveLength(0);
  });

  it('should render script when present', () => {
    const props = {
      list: [0, 4]
        .map((i) => mockLangTags[i])
        .concat([
          {
            full: 'de-Brai-DE',
            name: 'German, Standard',
            nophonvars: true,
            region: 'DE',
            regionname: 'Germany',
            script: 'Brai',
            sldr: false,
            tag: 'de-Brai',
          },
        ]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
      displayName: (curName: string, tag: LangTag | undefined) => curName,
      secondary: true,
    };
    render(<LanguageChoice {...props} />);
    expect(screen.getAllByText('de')).toHaveLength(1);
    expect(screen.getAllByText('de-Brai')).toHaveLength(1);
    expect(screen.getAllByText('German, Standard')).toHaveLength(2);
    expect(screen.getAllByText('A Language of Germany.')).toHaveLength(1);
    expect(
      screen.getAllByText('A Language of Germany in the Braille script.')
    ).toHaveLength(1);
  });

  it('should render alternate names when present', () => {
    const props = {
      list: [0, 4]
        .map((i) => mockLangTags[i])
        .concat([
          {
            full: 'de-Brai-DE',
            iana: ['German'],
            iso639_3: 'deu',
            name: 'German, Standard',
            names: ['Alemán', 'Allemand', 'Deutsch'],
            nophonvars: true,
            region: 'DE',
            regionname: 'Germany',
            script: 'Brai',
            sldr: false,
            tag: 'de-Brai',
            windows: 'de-Brai-DE',
          },
        ]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
      displayName: (curName: string, tag: LangTag | undefined) => curName,
      secondary: true,
    };
    render(<LanguageChoice {...props} />);
    expect(screen.getAllByText('de')).toHaveLength(1);
    expect(screen.getAllByText('de-Brai')).toHaveLength(1);
    expect(screen.getAllByText('German, Standard')).toHaveLength(2);
    expect(screen.getAllByText('A Language of Germany.')).toHaveLength(1);
    expect(
      screen.getAllByText('A Language of Germany in the Braille script.')
    ).toHaveLength(1);
    expect(screen.getAllByText('Alemán, Allemand, Deutsch')).toHaveLength(1);
  });

  it('should choose when clicked', () => {
    const props = {
      list: [0, 1, 2, 3].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
    };
    render(<LanguageChoice {...props} />);
    fireEvent.click(screen.getByText('English'));
    expect(props.choose).toHaveBeenCalled();
    expect(props.choose).toHaveBeenCalledWith(mockLangTags[1]);
  });

  it('should choose on keydown with space', () => {
    const props = {
      list: [0, 1, 2, 3].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
    };
    render(<LanguageChoice {...props} />);
    fireEvent.keyDown(screen.getByText('English'), { keyCode: 32 });
    expect(props.choose).toHaveBeenCalled();
    expect(props.choose).toHaveBeenCalledWith(mockLangTags[1]);
  });

  it('should choose on keydown with enter', () => {
    const props = {
      list: [0, 1, 2, 3].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
    };
    render(<LanguageChoice {...props} />);
    fireEvent.keyDown(screen.getByText('English'), { keyCode: 13 });
    expect(props.choose).toHaveBeenCalled();
    expect(props.choose).toHaveBeenCalledWith(mockLangTags[1]);
  });

  it('should not choose on keydown is not space or enter', () => {
    const props = {
      list: [0, 1, 2, 3].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
    };
    render(<LanguageChoice {...props} />);
    fireEvent.keyDown(screen.getByText('English'), { keyCode: 97 });
    expect(props.choose).not.toHaveBeenCalled();
  });

  it('should choose when clicked without secondary info', () => {
    const props = {
      list: [0, 1, 2, 3].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
      displayName: (curName: string) => curName,
    };
    render(<LanguageChoice {...props} />);
    fireEvent.click(screen.getByText('English'));
    expect(props.choose).toHaveBeenCalled();
    expect(props.choose).toHaveBeenCalledWith(mockLangTags[1]);
  });

  it('should render with custom displayName choose when clicked', () => {
    const props = {
      list: [0, 1, 2, 3].map((i) => mockLangTags[i]),
      choose: jest.fn(),
      t: languagePickerStrings_en,
      displayName: (curName: string) => curName.slice(0, 4),
    };
    render(<LanguageChoice {...props} />);
    fireEvent.click(screen.getByText('Engl'));
    expect(props.choose).toHaveBeenCalled();
    expect(props.choose).toHaveBeenCalledWith(mockLangTags[1]);
  });
});
