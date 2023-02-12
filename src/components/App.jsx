import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css'
import InputTimes from './timer/InputTimes';
import Timer from './timer/Timer';
import Button from './timer/Button';


function App() {
  return (
    <div>
      <h1 className="text-center">Focus</h1>

        <Timer></Timer>
        <InputTimes></InputTimes>
        <Button></Button>
      
        
    </div>
  );
}

export default App;
