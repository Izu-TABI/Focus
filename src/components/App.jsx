import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css'
import '../styles/CycleTimer.css'
import Timer from './timer/Timer';

function App() {
  return (
    <div>
      <h1 className="text-center">Focus</h1>
        <Timer></Timer>
        <button type="button" onClick={() => {console.log('hello')}}>ボタン２</button>
    </div>
  );
}

export default App;
