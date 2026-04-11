* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
  color: #333;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
}

header {
  background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

header p {
  opacity: 0.9;
  font-size: 1.1em;
}

main {
  padding: 30px 20px;
}

.card {
  background: #f5f5f5;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  border-left: 4px solid #0d47a1;
}

.card h2 {
  color: #0d47a1;
  margin-bottom: 15px;
}

.card h3 {
  color: #1976d2;
  margin-bottom: 10px;
}

.card p {
  line-height: 1.8;
  margin-bottom: 10px;
}

footer {
  background: #f5f5f5;
  padding: 20px;
  text-align: center;
  color: #666;
  border-top: 1px solid #ddd;
}

/* Install Button */
.install-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4caf50;
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
  z-index: 1000;
  transition: all 0.3s ease;
}

.install-btn:hover {
  background: #45a049;
  transform: scale(1.05);
  box-shadow: 0 7px 20px rgba(76, 175, 80, 0.6);
}

.install-btn:active {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 600px) {
  body {
    padding: 0;
  }
  
  .container {
    border-radius: 0;
    min-height: 100vh;
  }
  
  .install-btn {
    top: 10px;
    right: 10px;
    padding: 12px 20px;
    font-size: 14px;
  }
}

/* Status indicator */
#status {
  font-weight: bold;
}