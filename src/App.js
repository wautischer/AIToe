import './App.css';
import Camera from "./components/Camera";
import TicTacToe from "./components/TicTacToe";

function App() {
  return (
    <div className="App">
        <header className="App-header">
            <div className="row">
                <div className="col-sm-6">
                    <Camera/>
                </div>
                <div className="col-sm-6">
                    <TicTacToe/>
                </div>
            </div>
        </header>
    </div>
  );
}

export default App;
