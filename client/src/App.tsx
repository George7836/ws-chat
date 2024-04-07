import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { Home } from "./components/Home";

function App() {
  const [username, setUsername] = useState("");

  return username ? (
    <Home username={username} />
  ) : (
    <LoginForm onSubmit={setUsername} />
  );
}

export default App;
