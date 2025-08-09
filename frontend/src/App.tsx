import { useEffect, useRef, useState } from "react";

import "./App.css";
const App = () => {
  const [messages,setMessages] = useState<string[]>(["hi","hello","bye"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<any>("");
  useEffect(()=>{
    const ws = new WebSocket("http://localhost:8000");
    ws.onmessage = (event)=>{
      setMessages(m => [...m,event.data])
    }
    wsRef.current = ws;
    ws.onopen = ()=>{
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }))
    };
    return ()=>{
      ws.close();
    }
  },[]);

  return (
    <div className="text-white h-screen  bg-black">
      <div className="h-[80vh] border-blue-500 border-2  bg-red">
          {messages.map(x=><div><span className="bg-white m-3  text-black text-xl  h-[40px] w-[10vw] flex flex-col justify-center items-center ">
              {x}
            </span></div>)}
      </div>
      <div className="flex flex-row bg-blue-50">
        <input ref={inputRef} type="text" className="w-[90vw] p-4 text-xl text-black" name="" id="" />
        <button onClick={()=>{
          const value = inputRef.current?.value;
          wsRef.current.send(JSON.stringify({
            type:"chat",
            payload:{
              message:value
            }
          }))
        }} className="w-[10vw] cursor-pointer text-xl font-bold  bg-blue-900 text-blue">Send</button>
      </div>
    </div>
  )
}

export default App