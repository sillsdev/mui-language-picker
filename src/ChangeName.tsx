import React, { ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ILanguagePickerStrings } from './model';
import { languagePickerStrings_en as eng } from './localization';

interface IProps {
  isOpen: boolean;
  onClose?: () => void;
  curName?: string;
  onNewName?: (name: string) => void;
  t?: ILanguagePickerStrings;
}

export default function ChangeName({
  isOpen,
  onClose,
  curName,
  onNewName,
  t,
}: IProps) {
  const [open, setOpen] = React.useState(isOpen);
  const [name, setName] = React.useState(curName || '');

  const handleClose = (save?: boolean) => () => {
    if (save && name && onNewName) onNewName(name);
    if (onClose) onClose();
    setOpen(false);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog open={open} onClose={handleClose()}>
      <DialogTitle>{t?.changeName || eng.changeName}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t?.nameInstruction || eng.nameInstruction}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          data-testid="name"
          label={t?.newName || eng.newName}
          fullWidth
          value={name}
          onChange={handleNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose()}>{t?.cancel || eng.cancel}</Button>
        <Button onClick={handleClose(true)}>{t?.change || eng.change}</Button>
      </DialogActions>
    </Dialog>
  );
}
