import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Signin from './Signin';
import Dashboard from './Dashboard';
import PlaceOrder from './PlaceOrder';
import Home from './Home';
import NavBar from './Nav';
import EditForm from './EditForm';
import AboutUs from './aboutUs';
import Footer from './Footer';
// import AppAvailability from './AppAvailability ';

const App = () => {
 
  return (
    <>
    
    <Router>
    <NavBar/>
    
    {/* <AppAvailability> */}
      <Routes>

      <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders/:id/edit" element={<EditForm />} />
        <Route path="/about" element={<AboutUs />} />

       
      </Routes>
      {/* </AppAvailability> */}
    <Footer/>
    </Router>
    </>
  );
};

export default App;
