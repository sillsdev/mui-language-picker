import React, { useState, useEffect, KeyboardEvent } from 'react';
import { ILanguagePickerStrings } from './model';
import { LangTag } from './langPicker/types';
import {
  List,
  ListItemText,
  Typography,
  Box,
  ListItemButton,
} from '@mui/material';
import { scriptName } from './langTags';
import { debounce } from 'lodash';
import { GrowingSpacer } from './GrowingSpacer';
import { getDisplayName, DisplayName } from './getDisplayName';

interface IProps {
  list: LangTag[];
  choose: (tag: LangTag) => void;
  secondary?: boolean;
  displayName?: DisplayName;
  t: ILanguagePickerStrings;
}

export function LanguageChoice(props: IProps) {
  const { list, secondary, t, choose } = props;
  const { displayName } = props;
  const [dense] = useState(true);
  const [height, setHeight] = useState(window.innerHeight);

  const handleChoose = (tag: LangTag) => () => {
    choose(tag);
  };

  const handleKeydown = (tag: LangTag) => (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      choose(tag);
    }
  };

  useEffect(() => {
    const handleResize = debounce(() => setHeight(window.innerHeight), 100);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scriptDetail = (tag: LangTag) => {
    const tagParts = tag.tag.split('-');
    return tagParts.length > 1 && tagParts[1].length === 4
      ? t.inScript.replace('$1', scriptName.get(tagParts[1]) ?? tagParts[1])
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

  const langElems = (refList: LangTag[]) => {
    const filteredList = refList.filter((tag) => Boolean(tag?.tag));
    return filteredList.map((tag, i) => {
      return (
        <ListItemButton
          key={`${tag.tag} ${i}`}
          onClick={handleChoose(tag)}
          onKeyDown={handleKeydown(tag)}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex' }}>
                <Typography>
                  {getDisplayName(tag.name, tag, displayName)}
                </Typography>
                <GrowingSpacer />
                <Typography>{tag.tag}</Typography>
              </Box>
            }
            secondary={secondary ? detail(tag) : null}
          />
        </ListItemButton>
      );
    });
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <Box sx={{ backgroundColor: 'background.paper' }}>
        <List
          dense={dense}
          sx={{ overflowY: 'scroll' }}
          style={{ maxHeight: Math.max(height - 450, 200) }}
        >
          {langElems(list)}
        </List>
      </Box>
    </Box>
  );
}

export default LanguageChoice;
