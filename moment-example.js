var  moment = require('moment');
var now = moment();

console.log(now.format());
console.log(now.format('h:mma'));

console.log(now.format('MMM Do YYYY, h:mma'));

// UNIX time format
console.log(now.format('X')); // X --> Seconds from Jan 1 1970
console.log(now.format('x')); // x --> Seconds from Jan 1 1970

console.log(now.valueOf());  // This will return in the number format

var timestamp = 1456739157121;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.format());
console.log(timestampMoment.format('h:mm a'));
console.log(timestampMoment.local().format('h:mm a'));