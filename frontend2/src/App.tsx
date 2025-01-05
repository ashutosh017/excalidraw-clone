import { useRef } from "react";
import Whiteboard from "./components/WhiteBoard";

function App() {
const canvasRef = useRef<any>();
function Draw(){
  if(canvasRef.current.getContext){
    let ctx = canvasRef.current.getContext('2d')
    ctx.fillRect(250, 50, 100, 100);
    // ctx.clearRect(45, 45, 60, 60);
    // ctx.strokeRect(50, 50, 50, 50);

  }
}
  return (
    <div className="w-screen bg-zinc-900">
      <Whiteboard/>
      {/* <button onClick={Draw}>draw</button>
      <canvas ref={canvasRef} width={'1000px'} height={'1000px'} ></canvas> */}

    </div>
  )
}

export default App
