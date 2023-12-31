import './App.css';
import { useState, useEffect } from 'react';
import { useWhisper } from '@chengsokdara/use-whisper';

function App() {

  
  const [input, setInput] = useState("") ;
  const [modelss, setModels] = useState([]) ;
  const [CurrentModel,setCurrentModel] = useState("ada") ;
  const [output ,setOutput] = useState("") ;
  const [Song,setSong]=useState("");
  const [SongUrl,setSongUrl]=useState("");
  
  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey:"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"// "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", // YOUR_OPEN_AI_TOKEN
  })

  
  

  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "how can i help today"
  },
  {
    user: "me",
    message: "Hello!"
  }]) ;
  function clearChat(){
    setChatLog([]);
  }
  // useEffect(()=>{
  //   getEngines();
  // },[])
  // function getEngines(){
  //     fetch("http://localhost:3080/models",{
  //     method:"GET",
  //     headers:{
  //       "Content-Type":"application/json",
  //       Accept: "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   })
  //   .then(res=>res.json())
  //   .then(models=>{setModels(models.models);
  //   console.log(models.models)
  //   console.log(modelss)})
    
  // }
  // async function startListening1(e) {
  //   e.preventDefault();
  //   const prompt = input.trim();
  //   if (!prompt) return;
  //   try {
  //     const res = await fetch('/api/whisper', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ prompt }),
  //     });
  //     const data = await res.json();
  //     setResponse(data.choices[0].text);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  async function handlesubmit(e) {
    e.preventDefault();
    console.log(input);
    let chatLogNew= [ ...chatLog, { user: "me", message: `${input}`} ]
    await setInput("");
    setChatLog(chatLogNew)
    const messages=chatLogNew.map((message)=>message.message).join("\n")
    const response=await fetch("http://localhost:3080/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
         message: messages,
         CurrentModel
        //  chatLog.map((message)=>message.message).
        // join("")
      })
    });

    const data=await response.json();
    await setChatLog([ ...chatLogNew, { user: "gpt", message: `${data.message}` } ])
    console.log(data.message);
    const utterance = new SpeechSynthesisUtterance(data.message);
    speechSynthesis.speak(utterance);
    //setOutput(data.message);
    
}

async function handleInput(){
   // e.preventDefault();
    
    // await setChatLog([...chatLog,{user:"me",message:`${transcript.text}`}]);
    // console.log(transcript.text)
    
    
      console.log(typeof(transcript.text))
      const str=transcript.text;
      if(transcript.text!==undefined)
      {
        console.log(typeof(input));
        setInput(str);
        console.log(input);
        console.log(transcript.text);
        //handlesubmit();
        handleRead();
        console.log(Song);
      }
    }  
 const handleRead = async (e) => {
        try {
            //event.preventDefault();
            e.preventDefault();
            console.log(input);
            let str=input.substring(5);
            str=str.toLowerCase();
            str = str.replace(/\s/g, '');
            setSong(str);
            console.log(Song);
            const response = await fetch(`http://localhost:5001/${Song}`, {
                method: 'GET',
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const res = await response.json();
            //console.log(res[0].title);
            console.log(res);
            const url=res[0].url;
            console.log(url);
            // var audio = new Audio(`C:/Users/somaa/ps/loginregister/src/chatgpt/src/Oo Antava Oo Oo Antava.mp3`);
            // audio.play();
            //window.open("www.google.com",'_blank');
            window.open(`http://127.0.0.1:5500/loginregister/${url}`,'_blank');
            
        } catch (error) {
            console.error(error);
        }
        
    };   
    



  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat
        }>
          <span>+</span>
          New Chat
        </div>
        <div className='models'>
          <select onChange={(e)=>setCurrentModel(e.target.value)}>
            {modelss.map(({model,index})=>{
              <option key={model.id} value={model.id}>{model.id}</option>
            })}
          </select>

        </div>
      </aside>
      <section className='chatbox'>
        <div className='chat-log'>
          { chatLog.map((message, index)=>(
            <ChatMessage key={index} message={message} />
          ))}
         
        </div>
        
        <div className='chat-input-holder'>
          <form onSubmit={handlesubmit}>
          <input type="text" className='chat-input-textarea' rows="1" value={input} onChange={(e) => setInput(e.target.value)} />
          
          </form>
        </div>
        <div>
            <button  className="speech-buttons" onClick={()=>{
              startRecording();
              }} >Start Listening</button>
              {/* <p>{transcript.text}</p> */}
            {/* <form onSubmit={handlesubmit} > */}
            {/* <button className="speech-buttons" onClick={() => {stopRecording()
            }} value={input} onChange={() => setInput((transcript.text))} >Stop Listening</button> */}
            <button  className="speech-buttons" onClick={()=>{
              stopRecording();
              }} >Stop Listening</button>
              
            <button className="speech-buttons" onClick={handleInput} >Done</button>
            <button className="speech-buttons" onClick={handleRead} >Song</button>
            <button className="speech-buttons" onClick={handleRead} >Video</button>
             {/* </form> */}
           </div> 
          
        
      </section>
    </div> 
  );
}

const ChatMessage = ({ message }) => {
  return(
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
            <div className='chat-message-center'> 
            <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
            {message.user === "gpt" && <svg
    width={41}
    height={41}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth={1.5}
    className="h-6 w-6"
    
  >
    <path
      d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z"
      fill="currentColor"
    />
  </svg>}
            </div>
            
            <div className="message">
              {message.message}
            </div>
            </div>
          </div>
  )
}

export default App;