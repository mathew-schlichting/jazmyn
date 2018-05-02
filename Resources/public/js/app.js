/**
 * Created by Mathew on 4/10/2018.
 */

var annyang;

/***********   Commands   ********************/


function startListening(){
    annyang.resume();
}
function jazmyn (){
    console.log('Version: 0.0.1');
    
    var annyangInit = function(){
        var tries = 0;

        if(annyang) {
            console.log('Annyang successfully installed');
            annyang.addCommands(jazmynCommands);//add commands
            $.get('/commands', function (data){
                console.log('Loaded commands');
                saved = JSON.parse(data);
                startListening();
            });
        }
        else{
            console.log('Annyang not ready');
            if(tries < 5) {
                console.log('Retrying...');
                setTimeout(annyangInit, 1000);
            }
        }
    };
    setTimeout(annyangInit, 1000);
}

jazmyn();