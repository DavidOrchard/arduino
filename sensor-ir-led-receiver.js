var five = require("johnny-five"),
  board, ir;

var SerialPort = require("serialport").SerialPort;
var Port = new SerialPort("/dev/cu.usbmodem1411", {
    baudrate: 9600,
    buffersize: 1
  });

board = new five.Board( {port:Port});

/** start listening for serial port data */
Port.open(function() {
  Port.on('data', function(data) {
    console.log('data received: ' + data);
  });
});

board.on("ready", function() {
  Port.open(function() {
    Port.write("hello world from Arduino");
  })


  this.pinMode(10, five.Pin.INPUT);       // IR receiver
  this.pinMode(9, five.Pin.OUTPUT);       // IR transmitter
  
  this.loop(100, function() {

    irDetect(9, 10, 38000, function( value) {
        console.log(value);                    // Display 1/0 no detect/detect
    });
  }); 

});

// IR Object Detection Function

function irDetect(irLedPin, irReceiverPin, frequency, cb)
{
  tone(irLedPin, frequency, 8);              // IRLED 38 kHz for at least 1 ms
  this.wait(1, function() {
    this.digitalRead(irReceiverPin, function(value) {
        cb(value);
    });
  }); 
};
