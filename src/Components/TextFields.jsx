import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

const ZOHO = window.ZOHO;

export default function MultilineTextFields({services,setOpen,getTime}) {
  const [text,setText] = React.useState('')

  const [time,setTime] = React.useState("")

  const handleEvent =()=>{
    AddHandle();
    setOpen(false);

  }
  const AddHandle =()=>{
    var recordData = {
      Note: text,
      Service:services,
      Time: getTime,
      Name: "test"
    };
    ZOHO.CRM.API.insertRecord({
      Entity: "Timelog",
      APIData: recordData,
      Trigger: ["workflow"],
    }).then(function (data) {
      if (data?.data[0]?.code == "SUCCESS") {
        console.log(data);
    }});
  }

  // const getTime = (data) => {
  //   console.log(data)
  // }

  return (
    <>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '93%' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-multiline-static"
        //   label="Multiline"
          multiline
          rows={13}
          placeholder='Input Text'
          onChange={(e)=> setText(e.target.value)}
        />
      </div>
      </Box>
      <Box textAlign={"right"} p={4}>
      <Button variant="outlined" sx={{marginRight:"10px"}}>Cancel</Button>
      <Button variant="contained" onClick={handleEvent}>Submit</Button>
    </Box>
    </>
  )
}