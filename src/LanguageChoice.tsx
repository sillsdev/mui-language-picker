import React from 'react';
import { ILanguagePickerStrings } from './model';
import { LangTag, ScriptName } from './langPicker/types';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { debounce } from 'lodash';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
    },
    list: {
      overflowY: 'scroll',
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    firstLine: {
      display: 'flex',
    },
    grow: {
      flexGrow: 1,
    },
  })
);

interface IProps {
  list: number[];
  choose: (tag: LangTag) => void;
  secondary?: boolean;
  langTags: LangTag[];
  scriptName: ScriptName;
  t: ILanguagePickerStrings;
}

export function LanguageChoice(props: IProps) {
  const { list, langTags, scriptName, secondary, t, choose } = props;
  const classes = useStyles();
  const [dense] = React.useState(true);
  const [height, setHeight] = React.useState(window.innerHeight);

  const handleChoose = (tag: LangTag) => () => {
    choose(tag);
  };

  const handleKeydown = (tag: LangTag) => (e: any) => {
    if (e.keyCode === 32 || e.keyCode === 13) {
      choose(tag);
    }
  };

  React.useEffect(() => {
    const handleResize = debounce(() => setHeight(window.innerHeight), 100);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scriptDetail = (tag: LangTag) => {
    const tagParts = tag.tag.split('-');
    return tagParts.length > 1 && tagParts[1].length === 4
      ? t.inScript.replace('$1', scriptName[tagParts[1]])
      : '';
  };

  const detail = (tag: LangTag) => {
    return (
      <>
        <Typography component={'span'}>
          {t.languageOf
            .replace('$1', tag.regionname ? tag.regionname : '')
            .replace('$2', scriptDetail(tag))}
        </Typography>
        <br />
        <Typography component={'span'}>
          {tag.names ? tag.names.join(', ') : ''}
        </Typography>
      </>
    );
  };

  const langElems = (refList: number[], refTags: LangTag[]) => {
    return refList.map((r, i) => {
      const tag = refTags[r];
      return (
        <ListItem
          key={`${tag.tag} ${i}`}
          button
          onClick={handleChoose(tag)}
          onKeyDown={handleKeydown(tag)}
        >
          <ListItemText
            primary={
              <div className={classes.firstLine}>
                <Typography>{tag.name}</Typography>
                <div className={classes.grow}>{'\u00A0'}</div>
                <Typography>{tag.tag}</Typography>
              </div>
            }
            secondary={secondary ? detail(tag) : null}
          />
        </ListItem>
      );
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <List
          dense={dense}
          className={classes.list}
          style={{ maxHeight: Math.max(height - 450, 200) }}
        >
          {langElems(list, langTags)}
        </List>
      </div>
    </div>
  );
}

export default LanguageChoice;
