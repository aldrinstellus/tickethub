function App() {
  console.log("=== TESTING REACT MOUNT ===");
  return (
    <div style={{
      backgroundColor: 'red',
      color: 'white',
      padding: '50px',
      fontSize: '30px',
      minHeight: '100vh'
    }}>
      <h1>REACT MOUNT TEST</h1>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <p>Can you see this red background?</p>
    </div>
  );
}

export default App;
