export interface ILanguagePickerStrings {
  font: string;
  script: string;
  language: string;
  selectLanguage: string;
  findALanguage: string;
  codeExplained: string;
  subtags: string;
  details: string;
  languageOf: string;
  inScript: string;
  select: string;
  cancel: string;
  phonetic: string;
  changeName?: string;
  nameInstruction?: string;
  newName?: string;
  change?: string;
  noFonts?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
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
