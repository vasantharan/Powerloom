import './App.css';
import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.text())
        .then(result => {
          console.log(result);
          setRes(result);
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          setRes('Error uploading file:', error);
        });
    } else {
    }
  };
  return (
    <div>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <br/>
      <br/>
      {
        res
      }
    </div>
  );
}

export default App;
