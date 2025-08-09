import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({port:8000});

let map = new Map<String,WebSocket[]>();

wss.on("connection",(socket)=>{
   console.log("Connecting dude");
    socket.on("message",(message)=>{
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);

        if(parsedMessage.type === "join"){
            console.log("User Joined Room");
            const roomId = parsedMessage.payload.roomId;
            console.log("Room Id is "+(roomId));

            if(!map.has(roomId)){
                map.set(roomId,[socket]);
            }
            else{
                map.get(roomId)!.push(socket);
            }
            console.log("Map is \n"+map);
        }

        if(parsedMessage.type === "chat"){
            let userRoom = null;
            let flag: Boolean = false;
            for(const [key,value] of map){
                if(value.includes(socket)){
                    userRoom = key;
                    break;
                }
            }

            if(!userRoom) return;
            
            console.log("User room in chat is "+(userRoom));
            //@ts-ignore
            const res: WebSocket[] = map.get(userRoom);

            for(let i=0;i<res.length;i++){
                res[i].send(parsedMessage.payload.message);
                console.log("Sending dude");
            }
        }

    });



    socket.on("disconnect",(socket)=>{
        //socket.filter(x=>x!=socket);
        for(const [key,value] of map){
            const updatedArray = value.filter((x)=>x!==socket);
            if(updatedArray.length === 0){
                map.delete(key);
            }
            else{
                map.set(key,updatedArray);
            }
        }

    })
});



