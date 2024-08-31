const express = require('express');
const app = express();
const port = 4000; // Port number for the server
const { SerialPort } = require('serialport'); // Import SerialPort library
const { ReadlineParser } = require('@serialport/parser-readline'); // Import ReadlineParser

// Initialize SerialPort (replace '/dev/tty.usbmodemXXXX' with your actual Arduino port)
const portName = '/dev/tty.usbmodemF412FA6542002'; // Make sure to set this to the correct port
const arduinoPort = new SerialPort({ path: portName, baudRate: 9600 }); // Initialize the SerialPort
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' })); // Set up parser for incoming data

// Function to send command to Arduino and handle errors
const sendCommandToArduino = (command, res, successMessage) => {
  arduinoPort.write(`${command}\n`, (err) => {
    if (err) {
      console.error('Error sending command to Arduino:', err.message);
      res.status(500).send('Error communicating with Arduino');
    } else {
      res.send(successMessage);
    }
  });
};

// Define endpoints for controlling the claw machine
app.get('/arduino/start-left', (req, res) => sendCommandToArduino('start-left', res, 'Moving left'));
app.get('/arduino/stop-left', (req, res) => sendCommandToArduino('stop-left', res, 'Stopping left movement'));

app.get('/arduino/start-right', (req, res) => sendCommandToArduino('start-right', res, 'Moving right'));
app.get('/arduino/stop-right', (req, res) => sendCommandToArduino('stop-right', res, 'Stopping right movement'));

app.get('/arduino/start-fwd', (req, res) => sendCommandToArduino('start-fwd', res, 'Moving up'));
app.get('/arduino/stop-fwd', (req, res) => sendCommandToArduino('stop-fwd', res, 'Stopping up movement'));

app.get('/arduino/start-back', (req, res) => sendCommandToArduino('start-back', res, 'Moving down'));
app.get('/arduino/stop-back', (req, res) => sendCommandToArduino('stop-back', res, 'Stopping down movement'));

app.get('/arduino/drop', (req, res) => sendCommandToArduino('drop', res, 'dropping claw'));

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
