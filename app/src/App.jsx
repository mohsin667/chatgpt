import React,{useState,useEffect} from 'react'
import {BsFillChatRightFill , BsFillChatLeftFill , BsSendFill} from "react-icons/bs"

function App() {

  const [prompt, setPrompt] = useState("")
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [current,setCurrent] = useState("now")

  const chatGPTSystemMethod = {
    role: "system", content: "You are a helpful assistant."
  }

  const composePrompt = (e)=> {
    setPrompt(e.target.value)
  } 

  const callbackFunction = () => {
    console.log(messages)
  }

  const queryPrompt = () => {
    setMessages(previousState => [...previousState, {message: prompt, sender: "user"}])
    setTyping(true)
    setPrompt("")
    setCurrent(new Date().getMilliseconds())
  }

  const fetchApi = async () => {
    console.log()
    let chatRoles = messages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      
      return { role: role, content: messageObject.message}
    });
    console.log(chatRoles)
    const reqBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        chatGPTSystemMethod,
        ...chatRoles
      ]
    }
    console.log(reqBody)
    const api  = await fetch("https://api.openai.com/v1/chat/completions",{
      method: "POST",
      headers: {
        "Authorization": "Bearer " + import.meta.env.VITE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    }).then(data => {
      return data.json()
    }).then(data => {
      setTyping(false)
      setMessages(previousState => [...previousState, {message: data.choices[0].message.content, sender: "ChatGPT"}])
    })
    return api
  }

  useEffect(()=>{
    if(current !== "now") {
      fetchApi()
    }
  },[current])

  

  return (
    <div className='chatBox relative h-[100vh] mx-auto lg:max-w-2xl xl:max-w-3xl'>

      <div className='wrapper overflow-auto h-[calc(100%-87px)] flex flex-col-reverse'>
        <div className='min-h-full'>

          {messages && messages.length > 0 && messages.map((message,index)=> (
            <React.Fragment key={index}>
              <div className="flex px-3">
                <div className={`container mx-auto flex items-center ${message.sender === "ChatGPT" ? "flex-row" : "flex-row-reverse"}`}>
                  
                  {message.sender === "ChatGPT" 
                    ?<BsFillChatRightFill style={{fontSize:"22px", color:"rgb(255,255,255,0.8)", marginRight: "20px"}}/>
                    :<BsFillChatLeftFill style={{fontSize:"22px", color:"rgb(255,255,255,0.8)", marginLeft: "20px"}}/>
                  }
                  <p className='text-lg text-[#fff] bg-[#444654] py-3 px-5 rounded-lg my-1 w-[calc(100%-42px)]'>{message.message}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
          
        </div>

      </div>

      <div className='flex p-[5px] absolute bottom-[10px] w-full justify-center'>
        <div className="container relative">
          <div className='p-4 bg-[#3e414e] rounded-sm flex justify-between'>
            {typing ? <span className='absolute self-start top-[-20px] text-xs left-0 text-[#9ca3af]'>typing...</span> : ""}
            <input type='text' value={prompt} placeholder='Type your prompt' onChange={composePrompt} 
              className='w-[calc(100%-6rem)] m-0 rounded-sm bg-[#353641] outline-none p-[10px] box-border h-[45px]' />
            <button onClick={()=>queryPrompt(callbackFunction)} className='w-[5rem] flex items-center justify-center bg-[#353641] cursor-pointer'><BsSendFill style={{fontSize: "20px", color:"rgb(255,255,255,0.8)"}}/></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
