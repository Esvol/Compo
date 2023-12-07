import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { purple, indigo } from '@mui/material/colors';
import { IconButton, IconButtonProps } from '@mui/material';

export const RegistrationButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: purple[100],
    border: purple[900],
    backgroundColor: `${purple[900]}44`,
    '&:hover': {
      backgroundColor: purple[700],
      border: purple[700],
    },
}));

export const LoginButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: indigo[100],
    border: indigo[900],
    backgroundColor: `${indigo[900]}44`,
    '&:hover': {
      backgroundColor: indigo[700],
      border: indigo[700],
    },
}));

export const IconSearchButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    color: indigo[200],
    padding: '0.01px',
    transition: 'color 0.3s ease-in-out',
    '&:hover': {
      color: indigo[100],
    },
    '& .MuiSvgIcon-root': {
      fontSize: '30px', 
    },
}));
