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
    window.location.href = "http://127.0.0.1:5173/login";
  };

  useEffect(() => {
    // Fetch the user data from the Flask server after login
    const fetchUserData = async () => {
      const response = await fetch("http://127.0.0.1:5173/get_user", {
        method: 'GET',
    credentials: 'include'
      });
      const data = await response.json();
      console.log(data); // Logs the response from Flask, e.g., the session data

      // Check if user data is available from the query parameters
      const params = new URLSearchParams(window.location.search);
      const firstName = params.get("first_name");
      const lastName = params.get("last_name");

      if (firstName && lastName) {
        setUser({
          first_name: firstName,
          last_name: lastName,
        });
      }
    };

    fetchUserData();
  }, []); // Runs on component mount to fetch user data

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
