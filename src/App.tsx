function App() {
  console.log("=== BASIC REACT MOUNT TEST - NO IMPORTS ===");
  return (
    <div style={{
      backgroundColor: '#00ff00',
      color: 'black',
      padding: '30px',
      fontSize: '40px',
      fontWeight: 'bold',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      BASIC REACT TEST - GREEN SCREEN<br/>
      {new Date().toLocaleTimeString()}
    </div>
  );
}

export default App;
