import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
// import "./stopwatch.css";
const Stopwatch = ({open,setGetTime}) => {
  // state to store time
  const [time, setTime] = useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(true);

  // useEffect(()=>{
  //   startAndStop();
  // },[])

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

  // Method to start and stop timer
  if (open==='false') { 
    setIsRunning(!isRunning);
    setGetTime(`${hours}/${minutes}/${seconds}/${milliseconds}`)
  }
  // const startAndStop = () => {
  //   setIsRunning(!isRunning);
  // };
  // Method to reset timer back to 0
  const reset = () => {
    setTime(0);
  };

  // startAndStop()
  return (
    <Box className="stopwatch-container" display={"flex"} justifyContent={"flex-end"}>
      <Typography variant="p" pr={4} pt={2}>Time Log</Typography>
      
      <Box className="stopwatch" pr={4}>
      <p className="stopwatch-time"><b>
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(2, "0")}
        </b>
      </p>
      </Box>
    </Box>
  );
};

export default Stopwatch;
