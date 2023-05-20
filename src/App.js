import logo from "./logo.svg";
import "./App.css";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import MultipleSelect from "./Components/Heades";
import { grey } from "@mui/material/colors";
import MultilineTextFields from "./Components/TextFields";
import Stopwatch from "./Components/StopWatch";
import { useEffect, useState } from "react";

// format for zoho
// 2023-04-16T11:00:00+06:00

const ZOHO = window.ZOHO;
///headers section.....
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
  "Chart Review & Update",
  "Chart Note Request PCP",
  "Other See Below",
  "Sent Video",
  "Diabetes Education",
  "Diabetes Coordination",
  "Pain Management / Coordination",
  "Emergency Contact Outreach",
  "Education / Resources Requested",
  "Fall Risk Assessment",
  "Medication Management",
  "Physician Coordination",
  "Insurance Coordination",
  "Chart Review / Update",
  "Chart Creation",
  "Care Plan Quarterly Review / Update",
  "Others",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function App() {
  const [open, setOpen] = useState(true);
  const [services, setServices] = useState(null);
  const [getTime, setGetTime] = useState("");

  ///header section starts.........
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);

  const handleField = (data) => {
    handleServices(data.target.value);
    handleChange(data);
    // console.log(data)
  };

  const handleChange = (event) => {
    handleServices(personName);
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  ///header section ends.........

  ///stopwatch starts...........
  const [time, setTime] = useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
      // console.log(time);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  // Hours calculation
  const hours = Math.floor(time / 360000);

  // Minutes calculation
  const minutes = Math.floor((time % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((time % 6000) / 100);

  // Milliseconds calculation
  const milliseconds = time % 100;

  ///stopwatch ends.......
  const [initialTime, setInitialTime] = useState("");
  const [date, setDate] = useState("");
  const [entityId, setEntityId] = useState("");
  const [logName, setLogName] = useState("");
  useEffect(() => {
    // 2023-04-16T11:00:00+06:00
    let initial = new Date();

    let year = initial.getFullYear();
    let month = addzero(initial.getMonth() + 1);
    let x = initial.getMonth() + 1;
    let day = addzero(initial.getDate());
    let d = `${year}-${month}-${day}`;
    setDate(d);

    let m = helperObj[x];
    let amPm = initial.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let hours = addzero(initial.getHours());
    let minutes = addzero(initial.getMinutes());
    let seconds = addzero(initial.getSeconds());
    let initial_time = `${hours}:${minutes}:${seconds}`;
    function addzero(num) {
      return num < 10 ? `0${num}` : num;
    }
    setInitialTime(`${d}T${initial_time}+06:00`);
    setLogName(`${m} ${day},${year} ${amPm}`);

    ZOHO.embeddedApp.on("PageLoad", function (data) {
      console.log({ pageLoad: data });
      setEntityId(data.EntityId);
      ZOHO.CRM.UI.Resize({ height: "800", width: "1300", padding: "0px" }).then(
        function (data) {
          console.log(data);
        }
      );
    });

    ZOHO.embeddedApp.init();
  }, []);

  ///text field starts......
  const [text, setText] = useState("");

  // const [endTime,setEndTime] = useState('')

  const cancelEvent = () => {
    ZOHO.CRM.UI.Popup.close().then(function (data) {
      // console.log(data);
    });
  };

  const handleEvent = () => {
    let initial = new Date();
    let h = addzero(initial.getHours());
    let m = addzero(initial.getMinutes());
    let s = addzero(initial.getSeconds());
    let end_time = `${h}:${m}:${s}`;
    let endTime = `${date}T${end_time}+06:00`;

    function addzero(num) {
      return num < 10 ? `0${num}` : num;
    }
    let timer = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;

    AddHandle(timer, endTime);
  };

  const AddHandle = async (time, end_time) => {
    var recordData = {
      Description: text,
      Services_List: services,
      Time: time,
      Name: `${logName}-TimeLog`,
      Start_Time: initialTime,
      End_Time: end_time,
      Patient: `${entityId}`,
    };
    console.log(services);
    await ZOHO.CRM.API.insertRecord({
      Entity: "CCM_Program_Timelog",
      APIData: recordData,
      Trigger: ["workflow"],
    }).then(function (data) {
      console.log({ test: data });
      if (data?.data[0]?.code === "SUCCESS") {
        console.log("hello");
        ZOHO.CRM.UI.Popup.close();
      }
    });
  };

  ///text field ends......

  const handleServices = (data) => {
    // setServices(data)
    setServices(data);
  };
  return (
    <Container
      className="App"
      sx={{
        border: "1px solid #f1f1f1",
        p: "50px",
        mt: "3%",
        width: "87%",
        boxShadow: "4px 4px 4px #f1f1f1,-4px -4px 4px #f1f1f1",
      }}
    >
      <Box display={"flex"}>
        <Box
          display={"flex"}
          justifyContent={"space-evenly"}
          width={"40%"}
          pl={2}
        >
          <Typography variant="p" color={grey} mt={2}>
            Services
          </Typography>
          {/* multiselect code */}
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-name-label" sx={{ mb: "10px" }}>
              Dropdown
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={personName}
              onChange={(e) => handleField(e)}
              input={<OutlinedInput label="Dropdown" />}
              MenuProps={MenuProps}
              size="small"
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
        </Box>
        <Box textAlign={"right"} width={"60%"}>
          {/* stopwatch code */}
          <Box
            className="stopwatch-container"
            display={"flex"}
            justifyContent={"flex-end"}
          >
            <Typography variant="p" pr={4} pt={2}>
              Time Log
            </Typography>

            <Box className="stopwatch" pr={4}>
              <p className="stopwatch-time">
                <b>
                  {hours}:{minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}:
                  {milliseconds.toString().padStart(2, "0")}
                </b>
              </p>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* text field code */}
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "93%" },
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
            placeholder="Input Text"
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </Box>
      {/* button code */}
      <Box textAlign={"right"} p={4}>
        <Button
          variant="outlined"
          sx={{ marginRight: "10px" }}
          onClick={cancelEvent}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleEvent}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}

const helperObj = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Jan",
};

export default App;
