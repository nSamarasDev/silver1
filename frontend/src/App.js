import React from 'react';
import { useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./app/store";
import { loadUser } from "./actions/auth";
import Cookies from 'js-cookie'
import setAuthToken from "./utils/setAuthToken";
// import PrivateRoute from "./components/routing/PrivateRoute";
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'

const token = Cookies.get('token');

if (token) {
  setAuthToken(token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

return <Router>
  <Navbar />
  <Routes>
  <Route path="/" element={<Landing />} />
  </Routes>
</Router>
}

export default App;
