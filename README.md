# mui-language-picker

Material UI react language picker

## Installation

Complete information for [material-ui](https://mui.com/material-ui/).

```sh
npm install mui-language-picker --save
```

## Demo

[Demo of mui-language-picker](https://giphy.com/embed/5OkWd7aMlxOClWuF0J) / [Same demo as a video](https://youtu.be/aviV8aEaNOo) / [Try it yourself](http://mui-language-picker-demo.org.s3-website-us-east-1.amazonaws.com)

see also: [demo repo](https://github.com/sillsdev/mui-language-picker-demo)

## Usage

### TypeScript React 18 code

```typescript
import {
  LanguagePicker,
  ILanguagePickerStrings,
  languagePickerStrings_en,
  LangTag,
} from "mui-language-picker";

const MyComponent = (props: any) => {
  const [bcp47, setBcp47] = React.useState("und");
  const [lgName, setLgName] = React.useState("");
  const [fontName, setFontName] = React.useState("");
  const [rtl, setRtl] = React.useState(false);
  const [tag, setTag] = React.useState<LangTag>();

  const displayName = (name: string, tag?: LangTag) => {
    return tag?.localname ? `${tag?.localname} / ${name}` : tag?.name || name;
  };

  return (
    <LanguagePicker
      value={bcp47}
      setCode={setBcp47}
      name={lgName}
      setName={setLgName}
      font={fontName}
      setFont={setFontName}
      setDir={setRtl}
      displayName={displayName}
      setInfo={setTag}
      t={languagePickerStrings_en}
    />
  );
};
```

```sh
Output should be a Language Picker when entered opens a dialog
```

### Parameter definitions

| Parameter  | Type                    | Meaning                             |
| ---------- | ----------------------- | ----------------------------------- |
| value      | string                  | BCP 47 language code                |
| setCode\*  | (value: string) => void | callback to change BCP 47 value     |
| name       | string                  | language name                       |
| setName\*  | (name: string) => void  | callback to change language name    |
| font       | string                  | font family name                    |
| setFont\*  | (font: string) => void  | callback to change font family name |
| setDir\*   | (rtl: boolean) => void  | callback to change script direction |
| displayName\* | DisplayName          | function to control display of name |
| setInfo\*  | (tag: LangTag) => void  | callback to receive tag information |
| disabled\* | boolean                 | true if control disabled            |
| offline\*  | boolean                 | true if picker in offline setting   |
| required\* | boolean                 | true if language required (show *)  |
| t          | ILanguagePickerStrings  | localization strings (see below)    |

\* parameters marked with an asterisk are optional

### Helper functions

```typescript
import {
  getLangTag,
  getRtl,
  getFamily
} from "mui-language-picker";

console.log(getLangTag(tag)) // Return langTag object (see below)
console.log(getRtl(tag)) // returns true if rtl script
console.log(getFamily(familyId)) // Returns fontFamily object (see below)
```

The `fontName` returned by the Language Picker is the `familyId`. Refer to [fonts.languagetechnology.org](https://fonts.languagetechnology.org/) for more information.

### Localization Strings

```typescript
export const languagePickerStrings_en = {
  font: 'Font',
  script: 'Script',
  language: 'Language',
  selectLanguage: 'Choose Language Details',
  findALanguage: 'Find a language by name, code, or country',
  codeExplained: 'Code Explained',
  subtags: 'Subtags',
  details: 'Details',
  languageOf: 'A Language of $1$2.',
  inScript: ' in the $1 script',
  select: 'Save',
  cancel: 'Cancel',
  phonetic: 'Phonetic',
  changeName: 'Change Name',
  nameInstruction:
    'If you would like to change the language name enter the new name here.',
  newName: 'New Language Name',
  change: 'Change',
  noFonts: 'No recommended fonts',
} as ILanguagePickerStrings;
```

### Information returned by setInfo

```typescript
export interface LangTag {
  full: string;
  iana?: string[];
  iso639_3?: string;
  localname?: string;
  localnames?: string[];
  name: string;
  names?: string[];
  nophonvars?: boolean;
  region?: string;
  regionname?: string;
  regions?: string[];
  script: string;
  sldr: boolean;
  suppress?: boolean;
  tag: string;
  tags?: string[];
  variants?: string[];
  defaultFont?: string;
  fonts?: string[];
  windows?: string;
}
```

### Information returned by getFamily

```typescript
export interface IFamily {
  defaults?: {
    ttf: string;
    woff?: string;
    woff2?: string;
  };
  distributable: boolean;
  fallback?: string;
  family: string;
  familyid: string;
  files?: {
    [fileid: string]: {
      axes: {
        ital?: number;
        wght: number;
      };
      flourl?: string;
      packagepath: string;
      url?: string;
      zippath?: string;
    };
  };
  license?: 'OFL' | 'GPL3' | 'GPL' | 'Freeware' | 'proprietary' | 'shareware';
  packageurl?: string;
  siteurl?: string;
  source?:
    | 'SIL'
    | 'Google'
    | 'Microsoft'
    | 'NLCI'
    | 'STAR'
    | 'Evertype'
    | 'Lao Script';
  status?: 'current' | 'archived' | 'deprecated';
  version?: string;
  ziproot?: string;
}
```

### Change control background

If the theme involves using a dark background, the control background can be changed with css. See also [material-ui](https://mui.com/) documentation.

```css
#LangBcp47 .MuiFilledInput-root {
  background-color: rgba(255, 255, 255, 0.9);
}
```

### Build

```sh
npm install
npm run build
```

### Test

```sh
npm run clean
npm run index
npm test
```

### Testing Individual Suites

Here is an example for Language Picker tests:

```sh
npm test -- --watch LanguagePicker
```
