import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InfoIcon from '@mui/icons-material/Info';
import { ILanguagePickerStrings } from './model';
import { languagePickerStrings_en as eng } from './localization';
import { Chip, ListItem, Paper } from '@mui/material';

interface ChipData {
  key: number;
  label: string;
}

interface IProps {
  isOpen: boolean;
  onClose?: () => void;
  curFeats?: string;
  onNewFeat?: (feats: string) => void;
  offline?: boolean;
  t?: ILanguagePickerStrings;
}

export default function ChangeFeat({
  isOpen,
  onClose,
  curFeats,
  onNewFeat,
  offline = false,
  t,
}: IProps) {
  const [openFeat, setOpenFeat] = React.useState(isOpen);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [chipData, setChipData] = React.useState<ChipData[]>([]);
  const [oneFeat, setOneFeat] = React.useState<string>('');
  const [nextKey, setNextKey] = React.useState(1);
  const [helpText, setHelpText] = React.useState<string>('');

  React.useEffect(() => {
    if (curFeats) {
      let n = 0;
      const feats = curFeats
        .split(',')
        .map((feat) => {
          const m = /^"(\w\w\w\w)"\s*([0-9]?)$/.exec(feat.trim());
          if (!m) return undefined;
          return {
            key: ++n,
            label: m[2] ? `${m[1]} ${m[2]}` : m[1],
          };
        })
        .filter((v) => Boolean(v)) as ChipData[];
      setChipData(feats);
    }
  }, [curFeats]);

  const makeCssFeat = (chipValue: string) => {
    const m = /^(\w\w\w\w)\s*([0-9]?)$/.exec(chipValue.trim());
    return m ? (m[2] ? `"${m[1]}" ${m[2]}` : `"${m[1]}"`) : '';
  };

  const handleCloseFeatures = (save?: boolean) => () => {
    if (save && onNewFeat) {
      onNewFeat(chipData.map((chip) => makeCssFeat(chip.label)).join(', '));
    }
    if (onClose) onClose();
    setOpenFeat(false);
  };

  React.useEffect(() => {
    setOpenFeat(isOpen);
  }, [isOpen]);

  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  const handleAdd = () => {
    setOneFeat('');
    setOpenAdd(true);
  };

  const handleCloseAdd = (label: string | undefined) => () => {
    if (label && !makeCssFeat(label)) {
      setHelpText(t?.invalidFeature || eng.invalidFeature || '');
      return;
    }
    if (label) {
      setChipData(chipData.concat([{ key: nextKey, label }]));
      setNextKey(nextKey + 1);
    }
    setOpenAdd(false);
    setHelpText('');
  };

  const handleSelect = (chipToSelect: ChipData) => () => {
    setOneFeat(chipToSelect.label);
    setOpenAdd(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOneFeat(event.target.value);
  };

  return (
    <Dialog open={openFeat} onClose={handleCloseFeatures()}>
      <DialogTitle>{t?.changeFeatures || eng.changeFeatures}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <>
            {t?.featureInstruction || eng.featureInstruction}{' '}
            {!offline && (
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/OpenType_fonts_guide#Font_features"
                title="Open type font features"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InfoIcon fontSize="small" />
              </a>
            )}
          </>
        </DialogContentText>
        <>
          <Paper
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              listStyle: 'none',
              flexDirection: 'row',
              p: 0.5,
              m: 0,
            }}
            component="ul"
          >
            {chipData
              .map((data) => {
                return (
                  <ListItem key={data.key} sx={{ width: 'auto' }}>
                    <Chip
                      label={data.label}
                      onClick={handleSelect(data)}
                      onDelete={
                        chipData.length > 0 ? handleDelete(data) : undefined
                      }
                    />
                  </ListItem>
                );
              })
              .concat([
                <ListItem key={99} sx={{ width: 'auto' }}>
                  <Chip label="Add Feature" onClick={handleAdd} />
                </ListItem>,
              ])}
          </Paper>
          <Dialog open={openAdd} onClose={handleCloseAdd(undefined)}>
            <DialogTitle>Add a Font Feature</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the font feature to add.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="feature"
                label="Feature"
                fullWidth
                variant="standard"
                value={oneFeat}
                onChange={handleChange}
                helperText={helpText}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAdd(undefined)}>Cancel</Button>
              <Button onClick={handleCloseAdd(oneFeat)}>Add Feature</Button>
            </DialogActions>
          </Dialog>
        </>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseFeatures()}>
          {t?.cancel || eng.cancel}
        </Button>
        <Button onClick={handleCloseFeatures(true)}>
          {t?.change || eng.change}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
