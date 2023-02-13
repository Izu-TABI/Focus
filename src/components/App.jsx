import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css'
import '../styles/CycleTimer.css'
import Timer from './timer/Timer';

function App() {
  return (
    <div>
      <h1 className="text-center">Focus</h1>
        <Timer></Timer>
    </div>
  );
}

export default App;
