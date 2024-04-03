import React, { KeyboardEvent, ChangeEvent, MouseEvent } from 'react';
import { ILanguagePickerStrings } from './model';
import { LangTag } from './langPicker/types';
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
  SxProps,
  Tooltip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ChangeNameIcon from '@mui/icons-material/BorderColor';
import { woBadChar } from './util';
import LanguageChoice from './LanguageChoice';
import { hasExact, getExact, hasPart, getPart } from './index/LgExact';
import { getScripts } from './index/LgScripts';
import { scriptName } from './index/LgScriptName';
import { fontMap } from './index/LgFontMap';
import { bcp47Find, bcp47Index, bcp47Parse } from './bcp47';
import { langTags } from './langTags';
import useDebounce from './useDebounce';
import { GrowingSpacer } from './GrowingSpacer';
import ChangeName from './ChangeName';
import { getDisplayName, DisplayName } from './getDisplayName';
import rtlScripts from './data/rtlScripts';

const MAXOPTIONS = 50;

const menuWidth = { width: 200 } as SxProps;

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
}

export const LanguagePicker = (props: IProps) => {
  const { disabled } = props;
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
  if (!scriptName.hasOwnProperty(IpaTag)) scriptName[IpaTag] = t.phonetic;

  const respFormat = (iname: string, tagVal: string) => `${iname} (${tagVal})`;

  const handleClickOpen = (e: KeyboardEvent | MouseEvent) => {
    if (disabled) return;
    if ((e as KeyboardEvent)?.key && ["Tab", "Shift", "Control"].indexOf((e as KeyboardEvent).key) !== -1) return;
    const found = bcp47Find(curValue);
    if (curValue !== 'und') {
      if (found && !Array.isArray(found)) {
        const tagName = getDisplayName(curName, found, displayName);
        setResponse(respFormat(tagName, curValue));
        setTag(found);
        selectFont(found);
        setDefaultScript(found.script);
      } else {
        const key = (curValue ?? '').toLocaleLowerCase();
        if (hasExact(key)) {
          setResponse(respFormat(curName, curValue));
          const langTag = langTags[getExact(key)[0]];
          setTag(langTag);
          selectFont(langTag);
          setDefaultScript(langTag.script);
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
    { value: 'NotoSansLatn', label: 'Noto Sans (Recommended)', rtl: false },
    { value: 'AnnapurnaSIL', label: 'Annapurna SIL (Indic)', rtl: false },
    { value: 'Scheherazade', label: 'Scheherazade (Arabic)', rtl: true },
    { value: 'SimSun', label: 'SimSun (Chinese)', rtl: false },
  ];

  const selectDefaultFont = (code: string) => {
    const fonts = fontMap[code];
    setCurFont(fonts[0]);
    setFontOpts(fonts);
  };

  const selectFont = (tagP: LangTag | undefined) => {
    if (!tagP || tagP.tag === 'und') return;
    const parse = bcp47Parse(tagP.tag);
    const script = parse.script ? parse.script : tagP.script;
    const region = parse.region ? parse.region : tagP.region;
    let code = script;
    if (region) {
      code = script + '-' + region;
      if (!fontMap.hasOwnProperty(code)) {
        code = script;
      }
    }
    if (!fontMap.hasOwnProperty(code)) {
      setCurFont(safeFonts[0].value);
      setFontOpts(safeFonts.map((f) => f.value));
    } else selectDefaultFont(code);
  };

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

  const handleScriptChange = (tagP: LangTag | undefined) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDefaultScript(val);
    const parse = bcp47Parse(curValue);
    const script = parse.script ? parse.script : tagP?.script;
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
        if (val === IpaTag) selectDefaultFont(IpaTag);
        else selectFont(firstFind);
      }
    }
  };

  const selectScript = (tagP: LangTag) => {
    const tagParts = bcp47Parse(tagP.tag);
    selectFont(tagP);
    setDefaultScript(tagParts.script ? tagParts.script : tagP.script);
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

  const mergeList = (list: number[], adds: number[]) => {
    let result = list.filter((e) => adds.filter((f) => e === f).length > 0);
    result = result.concat(
      list.filter((e) => adds.filter((f) => e === f).length === 0)
    );
    return result.concat(
      adds.filter((e) => list.filter((f) => e === f).length === 0)
    );
  };

  const optList = () => {
    if (!tag && response) {
      let list = Array<number>();
      debouncedResponse.split(' ').forEach((w) => {
        if (w.length > 1) {
          const wLangTags = bcp47Index(w);
          if (wLangTags) {
            list = mergeList(list, wLangTags);
          } else {
            const token = woBadChar(w).toLocaleLowerCase();
            if (hasExact(token)) {
              list = mergeList(list, getExact(token));
            }
          }
        }
      });
      debouncedResponse.split(' ').forEach((w) => {
        if (w.length > 1) {
          const lastDash = w.lastIndexOf('-');
          if (lastDash !== -1) {
            const wLangTags = bcp47Index(w.slice(0, lastDash));
            if (wLangTags) list = mergeList(list, wLangTags);
          } else {
            const token = woBadChar(w).toLocaleLowerCase();
            if (hasPart(token)) {
              const tokLen = token.length;
              Object.keys(getPart(token)).forEach((k) => {
                if (list.length < MAXOPTIONS) {
                  if (token === k.slice(0, tokLen))
                    list = mergeList(list, getExact(k));
                }
              });
            }
          }
        }
      });
      if (list.length > 0) {
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
              langTags={langTags}
              scriptName={scriptName}
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
        required={true}
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
                sx={{ width: 150, mx: 1 }}
                label={`${t.script} *`}
                value={defaultScript}
                onChange={handleScriptChange(tag)}
                style={{ width: 400 }}
                SelectProps={{
                  MenuProps: { ...{ sx: menuWidth } },
                }}
                margin="normal"
                variant="filled"
              >
                {scriptList(tag)
                  .map((s: string) => (
                    <MenuItem key={s} value={s}>
                      {scriptName[s] + ' - ' + s}
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
          />
          <FormControlLabel
            control={
              <TextField
                id="select-font"
                data-testid="select-font"
                select
                sx={{ width: 300, mx: 1 }}
                label={`${t.font} *`}
                value={fontOpts.includes(curFont) ? curFont : ''}
                onChange={addFontInfo}
                SelectProps={{
                  MenuProps: { ...{ sx: menuWidth } },
                }}
                margin="normal"
                variant="filled"
              >
                {fontOpts.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            }
            label=""
          />
        </DialogContent>
        <DialogActions>
          <a
            href="https://www.w3.org/International/questions/qa-choosing-language-tags"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography>{t.codeExplained}</Typography>
          </a>
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
            disabled={tag === undefined}
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
