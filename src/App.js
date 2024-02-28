import './App.css';
import React, { useState, useRef } from 'react';
import Chart from 'chart.js/auto';

function App() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [sareeCount, setSareeCount] = useState(0);
  const [printingCount, setPrintingCount] = useState(1); // Initialize printing count to 1
  const [timeCount, setTimeCount] = useState([]);
  const [timeTaken, setTimeTaken] = useState();
  const [totTimeTaken, setTotTimeTaken] = useState(0);

  const chartRef = useRef();
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async() => {
    setTimeCount([])
    setTotTimeTaken(0)
    setTimeTaken(0)
    setSareeCount(0)
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('printingCount', printingCount);
      fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.text())
        .then(async(result) => {
          console.log(result);
          setRes(result);
          await delay(5000);
          for (let i = 1; i <= printingCount; i++) {
            setSareeCount(i);
            const randTime = Math.floor(Math.random() * (80 - 45 + 1)) + 45;
            console.log(randTime)
            setTimeCount(prevTime => [...prevTime, { time: randTime, count: i }]);
            console.log(timeCount)
            setTotTimeTaken((totTimeTaken + randTime))
            setTimeTaken( (totTimeTaken)/i )
            console.log(totTimeTaken)
            console.log(timeTaken)
            await delay(5000);
          }
          
          updateChart();
        })
        // .catch(error => {
        //   console.error('Error uploading file:', error);
        //   // setRes('Error uploading file:', error);
        // });
    } else {
      // Handle case where no file is selected
    }
  };

  const updateChart = () => {
    const ctx = chartRef.current.getContext('2d');
  
    // Destroy previous chart instance if it exists
    if (window.myChart instanceof Chart) {
      window.myChart.destroy();
    }
  
    window.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeCount.map((item) => item.count), // X-axis represents printing count
        datasets: [{
          label: 'Time Taken to Print (in Seconds)',
          data: timeCount.map(item => (item.time)), // Y-axis represents time taken in seconds
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Printing Count'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Time Taken (Seconds)'
            },
            beginAtZero: true
          }
        }
      }
    });
  };
  
  

  return (
    <div className="container">
      <h1 className="heading">File Upload</h1>
      <div className="file-input">
        <input type="file" id="file" onChange={handleFileChange} />
        <label htmlFor="file"><span>Choose File</span></label>
      </div>
      <div className="printing-count-input">
        <label htmlFor="printingCount">Printing Count:</label>
        <input type="number" id="printingCount" value={printingCount} onChange={(e) => setPrintingCount(parseInt(e.target.value))} />
      </div>
      <button className="upload-btn" onClick={handleUpload}>Upload</button>
      <div className="response">
        {res}
      </div>
      <div className="stats">
        <div className="stat">
          <h3>Sarees Printed</h3>
          <p>{sareeCount}</p>
        </div>
        <div className="stat">
          <h3>Time Taken to Print a Saree</h3>
          <p>{timeTaken > 0 ? `${(timeTaken)} Minutes` : 'N/A'}</p>
        </div>
        <div className="stat">
          <h3>Total Time Taken to Print</h3>
          <p>{totTimeTaken > 0 ? `${(totTimeTaken)} Minutes` : 'N/A'}</p>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default App;
