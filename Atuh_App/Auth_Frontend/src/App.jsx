import React, {useState } from "react";
import UserList from "./Components/UserList";

function App() {
 

  return (
    <div className="App">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-3xl">My App</h1>
      </header>
      <main className="p-4">
        <div className="flex flex-col items-center">
          <a
            href="http://localhost:5000/auth/google"
            className="bg-red-500 text-white py-2 px-4 rounded mb-4"
          >
            Sign In with Google
          </a>
          <a
            href="http://localhost:5000/auth/linkedin"
            className="bg-blue-700 text-white py-2 px-4 rounded"
          >
            Sign In with LinkedIn
          </a>
        </div>
        <UserList />
      </main>
    </div>
  );
}

export default App;
