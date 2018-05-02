/**
 * Created by Mathew on 4/12/2018.
 */
String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};
String.prototype.commandFormat = function() {
    return this.replaceAll(' ', '_');
};


const CLICK = 'click';
const HOVER = 'hover';
const TYPE = 'type';
const RIGHT_CLICK = 'rightClick';

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
    command = {stuff: [], timestamp: []};
    console.log('Recording...');
};

var saveType = function(words){
    command.stuff.push({'route': TYPE, 'data':words});
    command.timestamp.push(Date.now());
    console.log('Type: ', words);
}

var saveClick = function(){
    if(recording) {
        $.get('/getMousePos', function (data) {
            command.stuff.push({'route': CLICK, 'data':data});
            command.timestamp.push(Date.now());
            console.log('Click');
        });
    }
};

var saveClick = function(){
    if(recording) {
        $.get('/getMousePos', function (data) {
            command.stuff.push({'route': RIGHT_CLICK, 'data':data});
            command.timestamp.push(Date.now());
            console.log('Click');
        });
    }
};

var saveHover = function(){
    if(recording) {
        $.get('/getMousePos', function (data) {
                    command.stuff.push({'route': HOVER, 'data':data});
                    command.timestamp.push(Date.now());
                    console.log('Hover');
        });
    }
}

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
            for(i=0; i<cmd.stuff.length; i++){
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
        if(cmd.stuff[i].route === 'type'){
            $.get('/' + cmd.stuff[i].route + '/' + cmd.stuff[i].data, function (data) {if(!data)console.log('Failed ' + cmd.stuff[i].route)});
        }
        else{
            $.get('/' + cmd.stuff[i].route + '/' + cmd.stuff[i].data.x + '/' + cmd.stuff[i].data.y, function (data) {if(!data)console.log('Failed ' + cmd.stuff[i].route)});
        }
    }, cmd.timestamp[i] - startTime + 10);
}






var test = function(){
    if(!recording){
        console.log('Test');
    }
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
    'right click': ()=>{execute(saveRightClick);},
    'hover': ()=>{execute(saveHover);},
    'type *words': (a)=>{execute(saveType, a);},
    'command *name': (a)=>{execute(doCommand, a);},
    'test': ()=>{execute(test);}
};

function execute(fun, a, b, c, d){
    if(runCommand || recording){
        fun(a, b, c, d);
    }
    else{
        console.log('Must say "Okay Jazmyn" first!')
    }
    runCommand = false;
}