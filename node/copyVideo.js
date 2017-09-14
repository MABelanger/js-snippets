const execSync = require('child_process').execSync;

const MAIN_SEPARATOR = ' | ';
const START_END_SEPARATOR = '-';
const SECONDS_SEPARATOR = ':';

// Value to change ....
const IN_VIDEO_FILE = "videoIn.mp4";
const PARTS = [
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

function getParsedData(part) {
  let title = part.split(MAIN_SEPARATOR)[1];

  let times = part.split(MAIN_SEPARATOR)[0];
  let start = times.split(START_END_SEPARATOR)[0];
  let end = times.split(START_END_SEPARATOR)[1];

  // calc the number of seconds
  let seconds = getSeconds(end) - getSeconds(start);

  return {
    times,
    title,
    start,
    end,
    seconds
  };
}

function getInFileName(inVideoFile) {
  return "'" + inVideoFile + "'";
}

function getOutFileName(inVideoFile, nbEncodedVideo, times, title) {
  return " '" +
    inVideoFile + "-" +
    padZeros(nbEncodedVideo, 3) + "-" +
    times.replace(/\:/g, '.') +
    "-" + title + ".mp4" +
    "'";
}

function getCmd(parsedData, nbEncodedVideo) {
  let { times, title, start, seconds } = parsedData;

  // recompress audio to mono : -ac 1
  // recompress without black frame : -async 1
  let cmd =
    "ffmpeg -i " +
    getInFileName(IN_VIDEO_FILE) +
    " -c copy " +
    " -ss " + start +
    " -t " + seconds +
    " -y " +
    getOutFileName(IN_VIDEO_FILE, nbEncodedVideo, times, title);

  return cmd;
}


PARTS.map(part => {
  let parsedData = getParsedData(part);
  let cmd = getCmd(parsedData, nbEncodedVideo);
  //console.log('cmd', cmd)
  code = execSync(cmd);
  nbEncodedVideo += 1;
})
