import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css'
import InputTimes from './timer/InputTimes';
import Timer from './timer/Timer';
import Button from './timer/Button';
import CycleTimer from './timer/CycleTimer';

function App() {
  return (
    <div>
      <h1 className="text-center">Focus</h1>
        <Timer hello="world!" world="hello"></Timer>
        <CycleTimer time="10"></CycleTimer>
        <InputTimes></InputTimes>
        <Button></Button>
    </div>
  );
}

export default App;
