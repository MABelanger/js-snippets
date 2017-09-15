const execSync = require('child_process').execSync;

const MAIN_SEPARATOR = ' | ';
const START_END_SEPARATOR = '-';
const SECONDS_SEPARATOR = ':';

// Value to change ....
const IN_VIDEO_FILE = "videoIn.mp4";
const VIDEO_PARTS = [
  "00:11:05-00:14:10 | example 1",
  "00:19:11-00:20:44 | example 2",
  "00:23:20-00:26:00 | example 3",
  "00:32:25-00:59:57 | example 4",
  "01:00:00-01:13:27 | example 5"
];

let nbEncodedVideo = 0;

function padZeros(n, width, z) {
  // 1 -> 001 if width = 3
  // 1 -> 0001 if width = 4
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getSeconds(timeString) {
   var c = timeString.split(SECONDS_SEPARATOR);
   return parseInt(c[0]) * 3600 + parseInt(c[1]) * 60 + parseInt(c[2]);
}

// calc the number of deltaSeconds
function getDeltaSeconds(start, end) {
  let deltaSeconds = getSeconds(end) - getSeconds(start);
  return deltaSeconds;
}

function getParsedData(videoPart) {
  let title = videoPart.split(MAIN_SEPARATOR)[1];

  let timesColon = videoPart.split(MAIN_SEPARATOR)[0];
  let start = timesColon.split(START_END_SEPARATOR)[0];
  let end = timesColon.split(START_END_SEPARATOR)[1];

  let deltaSeconds = getDeltaSeconds(start, end)

  return {
    timesColon,
    title,
    start,
    end,
    deltaSeconds
  };
}

function getTimesDot(timesColon) {
  return timesColon.replace(/\:/g, '.')
}

function getInFileName(inVideoFile) {
  return " '" + inVideoFile + "' ";
}

function getOutFileName(inVideoFile, nbEncodedVideo, timesColon, title) {

  let nbEncodedVideoPadded = padZeros(nbEncodedVideo, 3); // 1 -> 001
  let timesDot = getTimesDot(timesColon); // 00:00:03-00:00:08 -> 00.00.03-00.00.08

  let outFileName =
    " '" +
    inVideoFile +
    "-" +
    nbEncodedVideoPadded +
    "-" +
    timesDot +
    "-" +
    title +
    ".mp4" +
    "' ";

    // " 'videoIn.mp4-000-00.00.03-00.00.08-example 1.mp4' "
    return outFileName;
}

function getCmd(parsedData, nbEncodedVideo) {
  let { timesColon, title, start, deltaSeconds } = parsedData;

  // recompress audio to mono : -ac 1
  // recompress without black frame : -async 1
  let cmd =
    "ffmpeg -i " + getInFileName(IN_VIDEO_FILE) +
    " -c copy " +
    " -ss " + start +
    " -t " + deltaSeconds +
    " -y " +
    getOutFileName(IN_VIDEO_FILE, nbEncodedVideo, timesColon, title);

  return cmd;
}

VIDEO_PARTS.map(videoPart => {
  let parsedData = getParsedData(videoPart);
  let cmd = getCmd(parsedData, nbEncodedVideo);
  //console.log('cmd', cmd)
  code = execSync(cmd);
  nbEncodedVideo += 1;
})
