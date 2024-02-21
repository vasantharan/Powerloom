import './App.css';
import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      fetch('/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.text())
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    } else {
    }
  };
  return (
    <div>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default App;
