# mui-language-picker

Material UI react language picker

## Installation

```sh
npm install mui-language-picker --save
```

## Usage

### TypeScript

```typescript
import {
  LanguagePicker,
  ILanguagePickerStrings,
  languagePickerStrings_en,
} from "mui-language-picker";

var MyComponent = () = {
  const [bcp47, setBcp47] = React.useState("und");
  const [lgName, setLgName] = React.useState("");
  const [fontName, setFontName] = React.useState("");
  const [tStr] = React.useState<ILanguagePickerStrings>(
    languagePickerStrings_en
  );
  
  return (
    <LanguagePicker
      value={bcp47}
      setCode={setBcp47}
      name={lgName}
      setName={setLgName}
      font={fontName}
      setFont={setFontName}
      t={tStr}
      />;
  )
}
```

```sh
Output should be a Language Picker when entered opens a dialog
```

### Build
```sh
npm install
npm run build
```

### Test

```sh
npm test
```
