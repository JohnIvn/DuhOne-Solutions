import schedule from 'node-schedule';

const job = schedule.scheduleJob('13 12 * * *', function () {
    console.log('Hello, World!');
});

console.log('Job scheduled to print "Hello, World!" at 12:13 PM.');

