import React, { useEffect } from 'react';
import AOS from 'aos';

import {
  Route,
  Routes
} from "react-router-dom";

import './css/style.scss';
import Home from './pages/Home';

function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  });
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [window.location.pathname]);

  return (
      <div>
        <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      </div>
  )
}

export default App;
