import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Intro Call",
  "RPM Outreach",
  "RPM Enrollment",
  "Patient Outreach",
  "HRA",
  "Intake Appointment",
  "Chart Review & Update",
  "EC Outreach",
  "Chart Note Request PCP",
  "Other See Below",
  "Sent Video",
  "Sent Email Information CC",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({handleServices}) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleField = (data) =>{
    handleServices(data.target.value);
    handleChange(data)
    // console.log(data)
  }

  const handleChange = (event) => {
    handleServices(personName)
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }} >
        <InputLabel id="demo-multiple-name-label" sx={{mb:"10px"}}>Dropdown</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={(e)=>handleField(e)}
          input={<OutlinedInput label="Dropdown" />}
          MenuProps={MenuProps}
          size='small'
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

