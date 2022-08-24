import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ILanguagePickerStrings } from './model';

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

  const handleClose = () => {
    onNewName && onNewName(name);
    onClose && onClose();
    setOpen(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t?.changeName || 'Change Name'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t?.nameInstruction ||
            'If you would like to change the language name enter the new name here.'}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t?.newName || 'New Language Name'}
          fullWidth
          value={name}
          onChange={handleNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t?.cancel}</Button>
        <Button onClick={handleClose}>{t?.change || 'Change'}</Button>
      </DialogActions>
    </Dialog>
  );
}
