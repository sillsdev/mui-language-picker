import React, { KeyboardEvent, ChangeEvent, MouseEvent, useMemo } from 'react';
import { ILanguagePickerStrings } from './model';
import { LangTag, ICodeFamily } from './langPicker/types';
import {
  Button,
  Dialog,
  DialogProps,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  IconButton,
  styled,
  Tooltip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ChangeNameIcon from '@mui/icons-material/BorderColor';
import LanguageChoice from './LanguageChoice';
import { bcp47Find, bcp47Parse } from './bcp47';
import {
  hasExact,
  getExact,
  hasPart,
  getPart,
  fontMap,
  getScripts,
  scriptName,
  displayFamily,
  getLangTag,
} from './langTags';
import useDebounce from './useDebounce';
import { GrowingSpacer } from './GrowingSpacer';
import ChangeName from './ChangeName';
import { getDisplayName, DisplayName } from './getDisplayName';
import rtlScripts from './data/rtlScripts';

const MAXOPTIONS = 50;

const StyledDialog = styled(Dialog)<DialogProps>(() => ({
  '& .MuiDialog-paperScrollPaper': {
    marginBottom: 'auto',
    width: '90%',
  },
}));

interface IStateProps {
  t: ILanguagePickerStrings;
}

interface IProps extends IStateProps {
  value: string;
  name: string;
  font: string;
  displayName?: DisplayName;
  setCode?: (code: string) => void;
  setName?: (name: string) => void;
  setFont?: (font: string) => void;
  setInfo?: (tag: LangTag) => void;
  setDir?: (rtl: boolean) => void;
  disabled?: boolean;
  offline?: boolean;
  required?: boolean;
}

export const LanguagePicker = (props: IProps) => {
  const { disabled, offline, required } = props;
  const { value, name, font, setCode, setName, setFont, setInfo, setDir, t } =
    props;
  const { displayName } = props;
  const [open, setOpen] = React.useState(false);
  const [curValue, setCurValue] = React.useState(value);
  const [curName, setCurName] = React.useState(name);
  const [curFont, setCurFont] = React.useState(font);
  const [secondary, setSecondary] = React.useState(true);
  const [response, setResponse] = React.useState('');
  const [tag, setTag] = React.useState<LangTag>();
  const [defaultScript, setDefaultScript] = React.useState('');
  const [fontOpts, setFontOpts] = React.useState(Array<string>());
  const [newName, setNewName] = React.useState(false);
  const langEl = React.useRef<HTMLInputElement | null>(null);

  const debouncedResponse = useDebounce({ value: response, delay: 500 });

  const IpaTag = 'fonipa';
  if (!scriptName.has(IpaTag)) scriptName.set(IpaTag, t.phonetic);

  const respFormat = (iname: string, tagVal: string) => `${iname} (${tagVal})`;

  const getDefScript = (val: string, script: string) =>
    val.indexOf(IpaTag) > 0 ? IpaTag : script;

  const handleClickOpen = (e: KeyboardEvent | MouseEvent) => {
    if (disabled) return;
    if (
      (e as KeyboardEvent)?.key &&
      ['Tab', 'Shift', 'Control'].indexOf((e as KeyboardEvent).key) !== -1
    )
      return;
    let found = bcp47Find(curValue);
    if (curValue !== 'und') {
      if (found && !Array.isArray(found)) {
        found = { ...found, tag: curValue };
        const tagName = getDisplayName(curName, found, displayName);
        setResponse(respFormat(tagName, curValue));
        setTag(found);
        selectFont(found);
        setDefaultScript(getDefScript(curValue, found.script));
      } else {
        const key = curValue ?? '';
        if (hasExact(key)) {
          setResponse(respFormat(curName, curValue));
          const langTag = getExact(key);
          if (langTag) {
            setTag(langTag);
            selectFont(langTag);
            setDefaultScript(getDefScript(key, langTag.script));
          }
        } else {
          handleClear();
        }
      }
    }
    setOpen(true);
  };

  React.useEffect(() => {
    if (open && curValue === 'und') {
      setTimeout(() => {
        if (langEl.current) {
          langEl.current.click();
        }
      }, 100);
    }
  }, [open, curValue]);

  const handleClear = () => {
    setFontOpts([]);
    setResponse('');
    setTag(undefined);
    setDefaultScript('');
    if (langEl.current) langEl.current.click();
  };
  const handleCancel = () => {
    setCurValue(value);
    setCurName(name);
    setCurFont(font);
    if (setCode) setCode(value);
    if (setName) setName(name);
    if (setFont) setFont(font);
    setTag(undefined);
    setDefaultScript('');
    setResponse('');
    setOpen(false);
  };

  const displayTag = (tagP: LangTag, val?: string) => {
    if (tagP && tagP.name) {
      const tagName = getDisplayName(tagP.name, tagP, displayName);
      setResponse(respFormat(tagName, tagP.tag));
      setCurValue(val ? val : tagP.tag);
      setCurName(tagP.name);
    }
  };

  const handleSelect = () => {
    if (setCode) setCode(curValue);
    if (setName) setName(curName);
    if (setFont) setFont(curFont);
    if (setDir) setDir(rtlScripts.includes(defaultScript));
    if (setInfo && tag) setInfo(tag);
    if (tag) {
      displayTag(tag, curValue);
    } else {
      setResponse('');
    }
    setTimeout(() => setOpen(false), 200);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setResponse(e.target.value);
  };

  const addFontInfo = (e: ChangeEvent<HTMLInputElement>) => {
    setCurFont(e.target.value);
  };

  const safeFonts = [
    { value: 'charissil', label: 'Charis SIL (Recommended)', rtl: false },
    { value: 'annapurnasil', label: 'Annapurna SIL (Indic)', rtl: false },
    { value: 'scheherazadenew', label: 'Scheherazade New (Arabic)', rtl: true },
    { value: 'notosanstc', label: 'Noto Sans TC (Chinese)', rtl: false },
  ];

  const selectDefaultFont = (scriptKey: string) => {
    const fontFamilyText = fontMap.get(scriptKey);
    if (fontFamilyText) {
      const fontFamily = JSON.parse(fontFamilyText) as ICodeFamily;
      const familyId = fontFamily.defaultfamily[0];
      if (familyId && fontFamily.families[familyId]) {
        setCurFont(fontFamily.families[familyId].familyid);
        setFontOpts(
          Object.keys(fontFamily.families).map(
            (f) => fontFamily.families[f].familyid
          )
        );
      }
    }
  };

  const selectFont = (tagP: LangTag | undefined) => {
    if (!tagP || tagP.tag === 'und') return;
    const parse = bcp47Parse(tagP.tag);
    const script = getDefScript(
      tagP.tag,
      parse.script ? parse.script : tagP.script
    );
    const region = parse.region ? parse.region : tagP.region;
    let key = script;
    if (region) {
      key = script + '-' + region;
      if (!fontMap.has(key)) {
        key = script;
      }
    }
    if (!fontMap.has(key)) {
      setCurFont(safeFonts[0].value);
      setFontOpts(safeFonts.map((f) => f.value));
    } else selectDefaultFont(key);
  };

  const hasFonts = useMemo(() => fontOpts && fontOpts.length > 0, [fontOpts]);

  const handleNewName = () => {
    setNewName(true);
  };

  const handleCloseName = () => {
    setNewName(false);
  };

  const handleSetName = (iname: string) => {
    setCurName(iname);
    const tagName = getDisplayName(iname, tag, displayName);
    if (tag) setResponse(respFormat(tagName, tag.tag));
  };

  React.useEffect(() => {
    if (response === '') handleClear();
  }, [response]);

  React.useEffect(() => {
    setCurValue(value);
    setCurName(name);
    setCurFont(font);
    setResponse(value !== 'und' ? name + ' (' + value + ')' : '');
  }, [value, name, font]);

  const handleScriptChange =
    (tagP: LangTag | undefined) => (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setDefaultScript(val);
      const parse = bcp47Parse(curValue);
      const script =
        parse.variant === IpaTag
          ? IpaTag
          : parse.script
          ? parse.script
          : tagP?.script;
      if (script !== val) {
        let newTag = parse.language || 'und';
        if (val !== IpaTag) newTag += '-' + val;
        if (parse.region) newTag += '-' + parse.region;
        const found = bcp47Find(newTag);
        if (found) {
          const firstFind = Array.isArray(found) ? found[0] : found;
          setTag(firstFind);
          let myTag = firstFind.tag;
          if (val === IpaTag) myTag += `-${IpaTag}`;
          else if (parse.variant && parse.variant !== IpaTag)
            myTag += '-' + parse.variant;
          if (parse.extension) myTag += '-' + parse.extension;
          parse.privateUse.forEach((i) => {
            myTag += '-x-' + i;
          });
          displayTag({ ...firstFind, tag: myTag });
          if (val === IpaTag) selectDefaultFont('Latn');
          else selectFont(firstFind);
        }
      }
    };

  const selectScript = (tagP: LangTag) => {
    const tagParts = bcp47Parse(tagP.tag);
    selectFont(tagP);
    setDefaultScript(
      getDefScript(tagP.tag, tagParts.script ? tagParts.script : tagP.script)
    );
  };

  const scriptList = (tagP: LangTag | undefined) => {
    if (!tagP) return [];
    return getScripts(tagP.tag.split('-')[0]).concat(IpaTag);
  };

  const handleLanguageClick = () => {
    if (tag) selectScript(tag);
    setTag(undefined);
  };

  const handleChoose = (tagP: LangTag) => {
    let newTag = tagP;
    const found = bcp47Find(response);
    let maxMatch = '';
    let tagList = [tagP.full, tagP.tag];
    if (tagP.iso639_3) {
      tagList.push(tagP.iso639_3);
      tagList.push(tagP.iso639_3 + '-' + tagP.script);
      if (tagP.region) {
        tagList.push(tagP.iso639_3 + '-' + tagP.region);
        tagList.push(tagP.iso639_3 + '-' + tagP.script + '-' + tagP.region);
      }
    }
    const parse = bcp47Parse(response);
    if (parse.extlang && parse.language) {
      tagList.push(parse.language);
      tagList.push(parse.language + '-' + tagP.script);
      if (tagP.region) {
        tagList.push(parse.language + '-' + tagP.region);
        tagList.push(parse.language + '-' + tagP.script + '-' + tagP.region);
      }
    }
    if (tagP.tags) {
      tagList = tagList.concat(tagP.tags.map((p) => p));
    }
    tagList.forEach((i) => {
      const tLen = i.length;
      if (tLen > maxMatch.length) {
        if (i === response.slice(0, tLen)) {
          if (response.length === tLen || response[tLen] === '-') {
            maxMatch = i;
          }
        }
      }
    });
    if (maxMatch !== '') {
      let newCode = tagP.tag;
      if (parse.variant && tagP.tag.indexOf(tagP.script) > 0) {
        newCode = tagP.tag.replace(`-${tagP.script}`, '');
      }
      newTag = { ...tagP, tag: newCode + response.slice(maxMatch.length) };
      displayTag(newTag);
    }
    setTag(newTag);
    if (maxMatch === '') {
      if (found === tagP) {
        newTag = { ...tagP, tag: response };
      } else if (Array.isArray(found) && found.indexOf(tagP) !== -1) {
        newTag = { ...tagP, tag: response };
      }
    }
    displayTag(newTag);
    selectScript(newTag);
    selectFont(newTag);
  };

  const optList = () => {
    if (!tag && debouncedResponse) {
      const list: LangTag[] = [];
      const tagLookup = getLangTag(debouncedResponse);
      if (tagLookup) {
        list.push(tagLookup);
      }
      // check for a part match
      const words = debouncedResponse.split(' ');
      const firstWord = words[0];
      if (hasPart(firstWord)) {
        const matches = getPart(firstWord);
        if (matches) {
          let result = matches.result;
          if (list.length > 0) {
            const exact = list[0].tag;
            result = result.filter((e) => e.tag !== exact);
          }
          if (words.length > 1) {
            words.slice(1).forEach((word) => {
              const nextMatches = getPart(word);
              if (nextMatches) {
                result = result.filter((e) => nextMatches.result.includes(e));
              }
            });
          }
          // put canonical name matches first
          const canonical: LangTag[] = [];
          const nonCanonical: LangTag[] = [];
          const lcFirst = firstWord.toLowerCase();
          result.forEach((e) => {
            if (e?.name.toLowerCase() === lcFirst) {
              canonical.push(e);
            } else {
              nonCanonical.push(e);
            }
          });

          list.push(...canonical, ...nonCanonical);
        }
      }
      if (list.slice(0, MAXOPTIONS).length > 0) {
        return (
          <>
            <FormGroup row sx={{ justifyContent: 'flex-end' }}>
              <FormControlLabel
                sx={{ flexDirection: 'row-reverse', mr: 0 }}
                control={
                  <Checkbox
                    checked={secondary}
                    onChange={(event) => setSecondary(event.target.checked)}
                    value="secondary"
                  />
                }
                label={t.details}
              />
            </FormGroup>
            <LanguageChoice
              list={list}
              secondary={secondary}
              choose={handleChoose}
              displayName={displayName}
              t={t}
            />
          </>
        );
      }
    }
    return <></>;
  };

  return (
    <div id="LangBcp47">
      <TextField
        variant="filled"
        margin="dense"
        id="lang-bcp47"
        label={t.language}
        required={required}
        style={{ width: 300 }}
        value={value !== 'und' ? name + ' (' + value + ')' : ''}
        onClick={handleClickOpen}
        onKeyDown={handleClickOpen}
        disabled={disabled ? disabled : false}
      />
      <StyledDialog
        id="LanguagePicker"
        open={open}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{t.selectLanguage}</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            id="language"
            label={t.findALanguage}
            fullWidth
            value={response}
            onChange={handleChange}
            onClick={handleLanguageClick}
            variant="outlined"
            InputProps={{
              ref: langEl,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="clear language"
                    onClick={handleClear}
                  >
                    <ClearIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {optList()}
          <FormControlLabel
            control={
              <TextField
                id="select-script"
                data-testid="select-script"
                select
                sx={{ mx: 1 }}
                fullWidth
                label={`${t.script} *`}
                value={defaultScript}
                onChange={handleScriptChange(tag)}
                margin="normal"
                variant="filled"
              >
                {scriptList(tag)
                  .map((s: string) => (
                    <MenuItem key={s} value={s}>
                      {scriptName.get(s) + ' - ' + s}
                    </MenuItem>
                  ))
                  .concat(
                    scriptList(tag).includes(defaultScript)
                      ? []
                      : [
                          <MenuItem key={defaultScript} value={defaultScript}>
                            {defaultScript}
                          </MenuItem>,
                        ]
                  )}
              </TextField>
            }
            label=""
            sx={{ width: '95%' }}
          />
          <FormControlLabel
            control={
              <TextField
                id="select-font"
                data-testid="select-font"
                select={hasFonts}
                helperText={!hasFonts ? t.noFonts : undefined}
                sx={{ mx: 1 }}
                fullWidth
                label={`${t.font}${hasFonts ? ' *' : ''}`}
                value={fontOpts.includes(curFont) ? curFont : ''}
                onChange={addFontInfo}
                margin="normal"
                variant="filled"
              >
                {fontOpts.map((s) => (
                  <MenuItem key={s} value={s}>
                    {displayFamily(s)}
                  </MenuItem>
                ))}
              </TextField>
            }
            label=""
            sx={{ width: '95%' }}
          />
        </DialogContent>
        <DialogActions>
          {!offline && (
            <a
              href="https://www.w3.org/International/questions/qa-choosing-language-tags"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography>{t.codeExplained}</Typography>
            </a>
          )}
          {curName !== '' && (
            <Tooltip title={t.changeName ?? 'Change name'}>
              <IconButton
                color="primary"
                size="small"
                data-testid="change-name"
                onClick={handleNewName}
              >
                <ChangeNameIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <GrowingSpacer />
          <Button onClick={handleCancel} color="primary">
            <Typography>{t.cancel}</Typography>
          </Button>
          <Button
            onClick={handleSelect}
            color="primary"
            disabled={
              required &&
              (tag === undefined || tag?.tag === 'und' || defaultScript === '')
            }
          >
            <Typography>{t.select}</Typography>
          </Button>
        </DialogActions>
      </StyledDialog>
      {newName && (
        <ChangeName
          isOpen={newName}
          onClose={handleCloseName}
          curName={curName}
          onNewName={handleSetName}
          t={t}
        />
      )}
    </div>
  );
};

export default LanguagePicker;
