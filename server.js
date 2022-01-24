var net = require('net');

var HOST = '127.0.0.1';
var PORT = 7000;

var boxes = new Map([])
var selected_box = ''
var choices = []
var result = ''

boxes.set('player', ['a', 'b'])
boxes.set('map', ['a', 'b'])

net.createServer(function (sock) {
    var state = 0
    sock.on('data', function (data) {
        string_data = data.toString()
        switch(state){
            case 0:
                sock.write(
`
Hello there, this is RANDOM BOT. 
Here are all your boxes
[ ${Array.from( boxes.keys() )} ]
or add more box by using 'add' command
Enter your command: `
                )
                state = 1
                break
            case 1: 
                if(string_data == 'add'){
                    sock.write("\nEnter box name: ")
                    state = 2
                    break
                }
                else if(boxes.has(string_data)){
                    selected_box = string_data
                    choices = boxes.get(string_data)
                    sock.write(
`
Selected Box: ${selected_box}
press Enter to continue
`
                    )
                    state = 4
                    break
                }else{
                    sock.write(
`
Invalid!
press Enter to continue
`
                    )
                    state = 0
                    break
                }
            case 2:
                boxes.set(string_data, [])
                selected_box = string_data
                sock.write("\nEnter box choices (seperate with space): ")
                state = 3
                break
            case 3:
                boxes.set(selected_box, string_data.split(" "))
                choices = boxes.get(selected_box)
                sock.write(
`
Your choices: ${choices}
press Enter to continue
`
                    )
                state = 4
                break
            case 4:
                sock.write(
`\nSelected Box: ${selected_box}
Please select options from below,

random - start random
reset - reset choices
box - reselect box
Enter your command: `
                )
                state = 5
                break
            case 5:
                if(string_data == 'random'){
                    var i = Math.floor(Math.random() * choices.length);
                    result = choices[i]
                    sock.write(
`
${result}
press Enter to exit
`
                    )
                    state = 6
                    break
                }
                else if(string_data == 'reset'){
                    sock.write("\nEnter box choices (seperate with space): ")
                    state = 3
                    break
                }
                else if(string_data == 'box'){
                    sock.write(
`
Here are all your boxes
[ ${Array.from( boxes.keys() )} ]
or add more box by using 'add' command
Enter your command: `
                )
                    state = 1
                    break
                }
                else{
                    sock.write(
`
Invalid!
press Enter to continue
`
                    )
                    state = 4
                    break
                }
            case 6:
                sock.end()
        };      
    });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST + ':' + PORT);