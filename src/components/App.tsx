import { useState } from "react";
import Main from "./Main";
import Title from "./Title";

function App() {
  const [started, setStarted] = useState(false);
  
  return started ? <Main /> : <Title onStart={() => setStarted(true)}/>;
}

export default App;
