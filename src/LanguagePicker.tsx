import React from 'react';
import { ILanguagePickerStrings } from './model';
import { LangTag } from './langPicker/types';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
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
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { woBadChar } from './util';
import LanguageChoice from './LanguageChoice';
import './LanguagePicker.css';
import clsx from 'clsx';
import { hasExact, getExact, hasPart, getPart } from './index/LgExact';
import { getScripts } from './index/LgScripts';
import { scriptName } from './index/LgScriptName';
import { fontMap } from './index/LgFontMap';
import { bcp47Find, bcp47Index, bcp47Parse } from './bcp47';
import { langTags } from './langTags';

const MAXOPTIONS = 50;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    check: {
      justifyContent: 'flex-end',
    },
    label: {
      flexDirection: 'row-reverse',
    },
    label2: {
      flexDirection: 'row-reverse',
      marginRight: 0,
    },
    textField: {
      width: 150,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    fontField: {
      width: 300,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    menu: {
      width: 200,
    },
    hide: {
      display: 'none',
    },
    grow: {
      flexGrow: 1,
    },
  })
);

interface IStateProps {
  t: ILanguagePickerStrings;
}

interface IProps extends IStateProps {
  value: string;
  name: string;
  font: string;
  setCode?: (code: string) => void;
  setName?: (name: string) => void;
  setFont?: (font: string) => void;
  disabled?: boolean;
}

export const LanguagePicker = (props: IProps) => {
  const { disabled } = props;
  const { value, name, font, setCode, setName, setFont, t } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [curValue, setCurValue] = React.useState(value);
  const [curName, setCurName] = React.useState(name);
  const [curFont, setCurFont] = React.useState(font);
  const [secondary, setSecondary] = React.useState(true);
  const [response, setResponse] = React.useState('');
  const [tag, setTag] = React.useState<LangTag>();
  const [defaultScript, setDefaultScript] = React.useState('');
  const [defaultFont, setDefaultFont] = React.useState('');
  const [fontOpts, setFontOpts] = React.useState(Array<string>());
  const langEl = React.useRef<any>();

  const TAB = 9;
  const SHIFT = 16;
  const CTRL = 17;

  const handleClickOpen = (e: any) => {
    if (disabled) return;
    if (e.keyCode && [TAB, SHIFT, CTRL].indexOf(e.keyCode) !== -1) return;
    const found = bcp47Find(curValue);
    if (curValue !== 'und') {
      if (found && !Array.isArray(found)) {
        setResponse(curName + ' (' + curValue + ')');
        setTag(found);
        selectFont(found);
        setDefaultScript(found.script);
        setDefaultFont(curFont);
      } else {
        const key = curValue.toLocaleLowerCase();
        if (hasExact(key)) {
          setResponse(curName + ' (' + curValue + ')');
          const langTag = langTags[getExact(key)[0]];
          setTag(langTag);
          selectFont(langTag);
          setDefaultScript(langTag.script);
          setDefaultFont(curFont);
        } else {
          handleClear();
        }
      }
    }
    setOpen(true);
  };
  const handleClear = () => {
    setFontOpts([]);
    setResponse('');
    setTag(undefined);
    setDefaultFont('');
    if (langEl.current) langEl.current.click();
  };
  const handleCancel = () => {
    setCurValue(value);
    setCurName(name);
    setCurFont(font);
    setOpen(false);
  };

  const displayTag = (tagP: LangTag) => {
    if (tagP && tagP.name) {
      setResponse(tagP.name + ' (' + tagP.tag + ')');
      setCurValue(tagP.tag);
      setCurName(tagP.name);
    }
  };

  const handleSelect = () => {
    if (setCode) setCode(curValue);
    if (setName) setName(curName);
    if (setFont) setFont(curFont);
    if (tag) {
      displayTag(tag);
    } else {
      setResponse('');
    }
    setOpen(false);
  };

  const handleChange = (e: any) => {
    setResponse(e.target.value);
  };

  const addFontInfo = (e: any) => {
    setDefaultFont(e.target.value);
    setCurFont(e.target.value);
  };

  const safeFonts = [
    { value: 'NotoSansLatn', label: 'Noto Sans (Recommended)', rtl: false },
    { value: 'AnnapurnaSIL', label: 'Annapurna SIL (Indic)', rtl: false },
    { value: 'Scheherazade', label: 'Scheherazade (Arabic)', rtl: true },
    { value: 'SimSun', label: 'SimSun (Chinese)', rtl: false },
  ];

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
      setDefaultFont(safeFonts[0].value);
      setCurFont(safeFonts[0].value);
      setFontOpts(safeFonts.map((f) => f.value));
    } else {
      const fonts = fontMap[code];
      setDefaultFont(fonts[0]);
      setCurFont(fonts[0]);
      setFontOpts(fonts);
    }
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

  const handleScriptChange = (tagP: LangTag | undefined) => (e: any) => {
    const val = e.target.value;
    setDefaultScript(val);
    const parse = bcp47Parse(curValue);
    const script = parse.script ? parse.script : tagP?.script;
    if (script !== val) {
      let newTag = parse.language + '-' + val;
      if (parse.region) newTag += '-' + parse.region;
      const found = bcp47Find(newTag);
      if (found) {
        const firstFind = Array.isArray(found) ? found[0] : found;
        setTag(firstFind);
        let myTag = firstFind.tag;
        if (parse.variant) myTag += '-' + parse.variant;
        if (parse.extension) myTag += '-' + parse.extension;
        parse.privateUse.forEach((i) => {
          myTag += '-x-' + i;
        });
        displayTag({ ...firstFind, tag: myTag });
        selectFont(firstFind);
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
    return getScripts(tagP.tag.split('-')[0]);
  };

  const handleLanguageClick = () => {
    if (tag) selectScript(tag);
    setTag(undefined);
  };

  const handleChoose = (tagP: LangTag) => {
    let newTag = tagP;
    const found = bcp47Find(response);
    let maxMatch = '';
    let tagList = [tagP.full];
    if (tagP.iso639_3) {
      tagList.push(tagP.iso639_3);
      tagList.push(tagP.iso639_3 + '-' + tagP.script);
      if (tagP.region) {
        tagList.push(tagP.iso639_3 + '-' + tagP.region);
        tagList.push(tagP.iso639_3 + '-' + tagP.script + '-' + tagP.region);
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
      newTag = { ...tagP, tag: tagP.tag + response.slice(maxMatch.length) };
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
    if (!tag) {
      let list = Array<number>();
      response.split(' ').forEach((w) => {
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
      response.split(' ').forEach((w) => {
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
            <FormGroup row className={classes.check}>
              <FormControlLabel
                className={classes.label2}
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
      <Dialog
        id="LanguagePicker"
        open={open}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{t.selectLanguage}</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
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
                <InputAdornment
                  position="end"
                  className={clsx({ [classes.hide]: response === '' })}
                >
                  <IconButton
                    edge="end"
                    aria-label="clear language"
                    onClick={handleClear}
                  >
                    <ClearIcon />
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
                select
                className={classes.textField}
                label={t.script}
                value={defaultScript}
                onChange={handleScriptChange(tag)}
                style={{ width: 400 }}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                helperText={''}
                margin="normal"
                variant="filled"
                required={true}
              >
                {scriptList(tag).map((s: string) => (
                  <MenuItem key={s} value={s}>
                    {scriptName[s] + ' - ' + s}
                  </MenuItem>
                ))}
              </TextField>
            }
            label=""
          />
          <FormControlLabel
            control={
              <TextField
                id="select-font"
                select
                className={classes.fontField}
                label={t.font}
                value={defaultFont}
                onChange={addFontInfo}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                helperText={''}
                margin="normal"
                variant="filled"
                required={true}
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
          <div className={classes.grow}>{'\u00A0'}</div>
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
      </Dialog>
    </div>
  );
};

export default LanguagePicker;
