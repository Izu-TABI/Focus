import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css'
import '../styles/CycleTimer.css'
import Home from './Home'
import UserData from './UserData';
import AccountSettings from './AccountSettings';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import HomeIcon from '@mui/icons-material/Home';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Other from './Other';

function App() {
  const [accountPage, setAcoountPage] = useState(false)
  const [homePage, setHomePage] = useState(true)
  const [userPage, setUserPage] = useState(false)
  const [otherPage, setOtherPage] = useState(false)

  const [value, setValue] = React.useState('recents');
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePageChange = (value) => {
    if (value === 'data') {
      setUserPage(true)
      setAcoountPage(false)
      setHomePage(false)
      setOtherPage(false)
    } else if (value === 'other') {
      setUserPage(false)
      setAcoountPage(false)
      setHomePage(false)
      setOtherPage(true)
    } else if (value === 'account') {
      setAcoountPage(true)
      setHomePage(false)
      setUserPage(false)
      setOtherPage(false)
    } else if (value === 'home') {
      setHomePage(true)
      setAcoountPage(false)
      setUserPage(false)
      setOtherPage(false)
    }
  }
  return (
    <div className="all-pages">
      
        {
          homePage ? (
            <Home></Home>
            ) : (
              userPage ? (
                <UserData></UserData>
              ) : (
                otherPage ? (
                  <Other></Other>
                ) : (
                  <AccountSettings></AccountSettings>
                )
              )
          )
        }
      
      

      <footer className='bottom-nav'>
        <BottomNavigation sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 , backgroundColor: '#f5f5f5'}} value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Home"
            value="home"
            onClick={() => {handlePageChange('home')}}
            icon={<HomeIcon/>}
          />

          <BottomNavigationAction
            label="Data"
            value="data"
            onClick={() => {handlePageChange('data')}}
            icon={<EqualizerIcon/>}
          />

        <BottomNavigationAction 
            label="Account" 
            value="account" 
            onClick={() => {handlePageChange('account')}}
          icon={<AccountCircleIcon/>
        } />

        <BottomNavigationAction 
            label="Other" 
            onClick={() => {handlePageChange('other')}}
          icon={<MoreHorizIcon/>
        } />



        </BottomNavigation>
      </footer>
    </div>
  );
}

export default App;
