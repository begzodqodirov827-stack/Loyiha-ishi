import React from 'react';
import AppRoutes from './routes/AppRoutes';
import TopBar from './components/layout/TopBar';

function App() {
  return (
    <div className="app-main-container">
      <TopBar />
      <main className="app-main-content">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
