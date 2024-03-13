import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Registration from './Components/Registration'; 
import UserHome from './Dashboard/User';
import MyRequests from './Pages/MyRequests';
import Service from './Dashboard/ServiceProvider';
import CardList from './Components/Services';
import RequestPage from './Components/RequestPage';
import ServiceCard from './Components/SearchCards';
import Header from './Components/Header';


function App() {
  return (
    <Router>
      <div>
        <Header/>
        <Routes>
        <Route index element={<Homepage />} />

          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/user" element={<UserHome />} />  
          <Route path="/myrequest" element={<MyRequests />} /> 
          <Route path="/service" element={<Service />} /> 
          <Route path='/list' element={<CardList/>} />
          <Route path='/requestpage' element={<RequestPage/>} />
          <Route path='/results' element={<ServiceCard/>} />




        </Routes>

        <Footer/>
      </div>
    </Router>
  );
}

export default App;
