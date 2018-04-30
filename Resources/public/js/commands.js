/**
 * Created by Mathew on 4/12/2018.
 */
String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};
String.prototype.commandFormat = function() {
    return this.replaceAll(' ', '_');
};




var runCommand = false;
var recording = false;

var saved = {};
var command = {};

var shutdown = function() {
    console.log('Shutting down...');
    $.get('/shutdown', function (data) {
        console.log(data);
    });
};

var startRecording = function(){
    recording = true;
    command = {click: [], timestamp: []};
    console.log('Recording...');
};

var saveClick = function(){
    if(recording) {
        $.get('/getMousePos', function (data) {
            command.click.push(data);
            command.timestamp.push(Date.now());
            console.log('Clicked');
        });
    }
};

var saveCommand = function(name){
    if(recording) {
        console.log('Saving...');
        saved[name.commandFormat()] = command;
        command = {};
        recording = false;
        console.log('Saved');
    }
};

var doCommand = function(name){
    var cmd;
    var startTime;
    var i;

    if(!recording){
        cmd = saved[name.commandFormat()];
        if(cmd !== undefined){
            console.log(cmd);

            startTime = cmd.timestamp[0];
            for(i=0; i<cmd.click.length; i++){
                setTimeoutForCommand(cmd, i, startTime);
            }
        } else {
            console.log('No command: ', name);
        }
    }
};

function setTimeoutForCommand(cmd, i, startTime){
    console.log(cmd.timestamp[i] - startTime);
    setTimeout(() => {
        $.get('/click/' + cmd.click[i].x + '/' + cmd.click[i].y + '/false', function (data) {if(!data)console.log('Failed click')});
    }, cmd.timestamp[i] - startTime + 10);
}






var test = function(){
    console.log('Test');
};

var prepareCommand = function (){
    if(!recording){
        runCommand=true;
        console.log('Listening for command..');
    }
};

var jazmynCommands = {
    'okay Jasmine': prepareCommand,
    'shutdown': ()=>{execute(shutdown);},
    'start recording': ()=>{execute(startRecording);},
    'save recording as *name': (a)=>{execute(saveCommand, a);},
    'click': ()=>{execute(saveClick);},
    'command *name': (a)=>{execute(doCommand, a);},
    'test': ()=>{execute(test);}
};

function execute(fun, a, b, c, d){
    if(runCommand || recording){
        fun(a, b, c, d);
    }
    else{
        console.log('Must say "Hey Jazmyn" first!')
    }
    runCommand = false;
}