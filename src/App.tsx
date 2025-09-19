function App() {
  console.log("BASIC APP MOUNT TEST");
  return (
    <div style={{
      backgroundColor: '#ff0000',
      color: 'white',
      padding: '30px',
      fontSize: '40px',
      fontWeight: 'bold',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      BASIC REACT TEST<br/>
      {new Date().toLocaleTimeString()}
    </div>
  );
}

export default App;
