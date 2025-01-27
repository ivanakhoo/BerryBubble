import { Fragment } from "react/jsx-runtime";
import ListGroup from "./components/ListGroup";
import NavBar from "./components/NavBar";
function App() {
  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login";
  };
  return <Fragment>
    <div><NavBar/></div>
    <div><ListGroup/></div>
    <button onClick={handleLogin} className="btn btn-primary mt-3">
        Login with LinkedIn
      </button>
    </Fragment>
}

export default App;

