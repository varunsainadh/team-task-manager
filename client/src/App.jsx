import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://team-task-manager-production-a45a.up.railway.app")
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Frontend Connected 🚀</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;