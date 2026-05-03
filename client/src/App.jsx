import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
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