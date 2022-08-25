# mui-language-picker

Material UI react language picker

## Installation

Complete information for [material-ui](https://mui.com/material-ui/).

```sh
npm install mui-language-picker --save
```

## Usage

### TypeScript React 18 code

```typescript
import {
  LanguagePicker,
  ILanguagePickerStrings,
  languagePickerStrings_en,
  LangTag,
  DisplayName,
} from "mui-language-picker";

const MyComponent = (props: any) => {
  const [bcp47, setBcp47] = React.useState("und");
  const [lgName, setLgName] = React.useState("");
  const [fontName, setFontName] = React.useState("");
  const [tag, setTag] = React.useState<LangTag>()

  const displayName = (name: string, tag?:LangTag) => {
    return tag.localname || tag.name
  }

  return (
    <LanguagePicker
      value={bcp47}
      setCode={setBcp47}
      name={lgName}
      setName={setLgName}
      font={fontName}
      setFont={setFontName}
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
| displayName\* | DisplayName          | function to control display of name |
| setInfo\*  | (tag: LangTag) => void  | callback to receive tag information |
| disabled\* | boolean                 | true if control disabled            |
| t          | ILanguagePickerStrings  | localization strings (see below)    |

\* parameters marked with an asterisk are optional

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
} as ILanguagePickerStrings;
```

### Information returned by setInfo

```typescript
export interface LangTag {
  full: string;
  iana?: string;
  iso639_3?: string;
  localname?: string;
  name: string;
  names?: string[];
  nophonvars?: boolean;
  region?: string;
  regionname?: string;
  regions?: string[];
  script: string;
  sldr: boolean;
  tag: string;
  tags?: string[];
  variants?: string[];
  defaultFont?: string;
  fonts?: string[];
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
