import React, { ChangeEvent } from 'react';
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
  const [open, setOpen] = React.useState(isOpen);
  const [feats, setFeats] = React.useState(curFeats || '');

  const handleClose = (save?: boolean) => () => {
    if (save && feats && onNewFeat) onNewFeat(feats);
    if (onClose) onClose();
    setOpen(false);
  };

  const handleFeatChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFeats(event.target.value);
  };

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog open={open} onClose={handleClose()}>
      <DialogTitle>{t?.changeFeatures || eng.changeFeatures}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <>
            {t?.featureInstruction || eng.featureInstruction}{' '}
            {!offline && (
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/OpenType_fonts_guide#Font_features"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InfoIcon fontSize="small" />
              </a>
            )}
          </>
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="features"
          data-testid="feat"
          label={t?.newName || eng.newName}
          fullWidth
          value={feats}
          onChange={handleFeatChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose()}>{t?.cancel || eng.cancel}</Button>
        <Button onClick={handleClose(true)}>{t?.change || eng.change}</Button>
      </DialogActions>
    </Dialog>
  );
}
