import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("High"); // Default prompt value
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validCredentials = {
    username: "user",
    password: "admin123",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === validCredentials.username && password === validCredentials.password) {
      setIsLoggedIn(true);
    } else {
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !prompt.trim()) {
      alert("Please select a file and select a consumption type.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("query", prompt);

    try {
      const res = await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(res.data.answer);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("Error occurred while uploading the file.");
    }
  };

  const handleChat = async () => {
    try {
      const res = await axios.post("http://localhost:8080/chat", { query });
      setResponse(res.data.answer);
    } catch (error) {
      console.error("Error querying chat:", error);
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="login-section">
          <h1 className="title">Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="input-text"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-text"
              required
            />
            <button type="submit" className="btn btn-login">Login</button>
          </form>
        </div>
      ) : (
        <div className="main-section">
          <h1 className="title">Predictive Analytics with chatbot consultation</h1>
          <div className="upload-section">
            <div className="file-upload">
              <label className="label">Upload File:</label>
              <input type="file" onChange={handleFileChange} className="input-file" />
            </div>
            <div className="prompt-select">
              <label className="label">Pilih Konsumsi Energi:</label>
              <select
                className="input-select"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              >
                <option value="High">Highest</option>
                <option value="Low">Lowest</option>
              </select>
            </div>
            <button onClick={handleUpload} className="btn btn-upload">Upload and Analyze</button>
          </div>
          <div className="query-section">
            <label className="label">Ask a Question:</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your question..."
              className="input-text"
            />
            <button onClick={handleChat} className="btn btn-chat">Chat</button>
          </div>
          <div className="response-section">
            <h2 className="response-title">Response</h2>
            <p className="response-text">{response}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;