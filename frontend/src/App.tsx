import React, { Fragment, useState, useEffect } from "react";
import ListGroup from "./components/ListGroup";
import NavBar from "./components/NavBar";

interface User {
  first_name: string;
  last_name: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // State to store user info

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login";
  };

  useEffect(() => {
    // Check if query parameters are present
    const params = new URLSearchParams(window.location.search);
    const firstName = params.get("first_name");
    const lastName = params.get("last_name");

    if (firstName && lastName) {
      setUser({
        first_name: firstName,
        last_name: lastName,
      });
    }
  }, []); // Runs on component mount to extract query parameters

  return (
    <Fragment>
      <div>
        <NavBar />
      </div>
      <div>
        <ListGroup />
      </div>
      {!user ? (
        <button onClick={handleLogin} className="btn btn-primary mt-3">
          Login with LinkedIn
        </button>
      ) : (
        <div className="mt-3">
          <h3>Welcome, {user.first_name} {user.last_name}!</h3>
          {/* Render the rest of your user data here */}
        </div>
      )}
    </Fragment>
  );
};

export default App;


