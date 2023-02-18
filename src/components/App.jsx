import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css'
import '../styles/CycleTimer.css'
import Home from './Home'
import UserData from './UserData';
import AccountSettings from './AccountSettings';
import { useState } from 'react';

import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import HomeIcon from '@mui/icons-material/Home';

function App() {
  const [accountPage, setAcoountPage] = useState(false)
  const [homePage, setHomePage] = useState(true)
  const [userPage, setUserPage] = useState(false)

  const [value, setValue] = React.useState('recents');
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleHomeChange = () => {
    setHomePage(true)
    setAcoountPage(false)
    setUserPage(false)
  } 

  const handleAccountChange = () => {
    setAcoountPage(true)
    setHomePage(false)
    setUserPage(false)
  } 

  const handleUserDataChange = () => {
    setUserPage(true)
    setAcoountPage(false)
    setHomePage(false)
  }
  return (
    <div>
      <h1 className="text-center app-name-main">Focus</h1>
      {
        homePage ? (
          <Home></Home>
          ) : (
            userPage ? (
              <UserData></UserData>
            ) : (
              <AccountSettings></AccountSettings>
            )
        )

      }

      <footer className='bottom-nav'>
        <BottomNavigation sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Home"
            value="home"
            onClick={handleHomeChange}
            icon={<HomeIcon/>}
          />

          <BottomNavigationAction
            label="Data"
            value="data"
            onClick={handleUserDataChange}
            icon={<EqualizerIcon/>}
          />

        <BottomNavigationAction 
            label="Account" 
            value="account" 
            onClick={handleAccountChange}
          icon={<AccountCircleIcon/>
        } />


        </BottomNavigation>
      </footer>
    </div>
  );
}

export default App;
