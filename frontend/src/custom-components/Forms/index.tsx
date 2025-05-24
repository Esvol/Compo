import { alpha, styled } from '@mui/material/styles';
import { purple, indigo, pink, green } from '@mui/material/colors';
import { FormControl, FormControlProps, Switch } from '@mui/material';

export const SortFormControl = styled(FormControl)<FormControlProps>(({ theme }) => ({
    color: indigo[300], // Цвет текста выбранного юзером варианта
  backgroundColor: 'transparent', // Прозрачный фон
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)', // Прозрачный фон при наведении 
  },
  '& .MuiSelect-icon': {
    color: indigo[300], // Цвет иконки стрелки
  },
  '& .MuiSelect-root': {
    paddingLeft: '8px', // Добавим небольшой отступ слева
  },
}));

export const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: green[500],
    '&:hover': {
      backgroundColor: alpha(green[500], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: green[500],
  },
  '& .MuiSwitch-switchBase': {
    color: indigo[100],
    '&:hover': {
      backgroundColor: alpha(indigo[100], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase + .MuiSwitch-track': {
    backgroundColor: indigo[100],
  },
}));