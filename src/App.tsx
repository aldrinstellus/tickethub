function App() {
  console.log("=== APP RENDERING ===");
  return (
    <div style={{
      background: 'red',
      color: 'white',
      padding: '50px',
      fontSize: '30px',
      minHeight: '100vh'
    }}>
      <h1>EMERGENCY TEST - CAN YOU SEE THIS?</h1>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <p>If you see this red background, React is working</p>
    </div>
  );
}

export default App;
