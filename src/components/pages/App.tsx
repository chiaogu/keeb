import Main from '@src/components/pages/Main';
import Title from '@src/components/pages/Title';
import { useState } from 'react';

function App() {
  const [started, setStarted] = useState(false);

  return started ? <Main /> : <Title onStart={() => setStarted(true)} />;
}

export default App;
