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
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import Other from './Other';

import { auth } from '../database/firebase';

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';


function App() {
  const [accountPage, setAcoountPage] = useState(false)
  const [homePage, setHomePage] = useState(true)
  const [userPage, setUserPage] = useState(false)
  const [otherPage, setOtherPage] = useState(false)

  const [value, setValue] = React.useState('recents');

  const signOut = () => {
    auth.signOut()
    window.location.reload()
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePageChange = (value) => {
    const dataDom = document.getElementById('menu-data');
    const otherDom = document.getElementById('menu-other');
    const accountDom = document.getElementById('menu-account');
    const homeDom = document.getElementById('menu-home');

    if (value === 'data') {
      setUserPage(true);
      setAcoountPage(false);
      setHomePage(false);
      setOtherPage(false);
      dataDom.style.borderLeft = '3px solid #6ebdf1';
      dataDom.style.backgroundColor = '#ffffff';
      dataDom.style.color = '#1C9BF0';

      otherDom.style.borderLeft = '0 solid #6ebdf1';
      otherDom.style.backgroundColor = '#eeebeb';
      otherDom.style.color = '#555555';

      accountDom.style.borderLeft = '0 solid #6ebdf1';
      accountDom.style.backgroundColor = '#fafafa';
      accountDom.style.color = '#555555';

      homeDom.style.borderLeft = '0 solid #6ebdf1';
      homeDom.style.backgroundColor = '#eeebeb';
      homeDom.style.color = '#555555';

    } else if (value === 'other') {
      setUserPage(false);
      setAcoountPage(false);
      setHomePage(false);
      setOtherPage(true);
      dataDom.style.borderLeft = '0 solid #6ebdf1';
      dataDom.style.backgroundColor = '#eeebeb';
      dataDom.style.color = '#555555';

      otherDom.style.borderLeft = '3px solid #6ebdf1';
      otherDom.style.backgroundColor = '#ffffff';
      otherDom.style.color = '#1C9BF0';

      accountDom.style.borderLeft = '0 solid #6ebdf1';
      accountDom.style.backgroundColor = '#fafafa';
      accountDom.style.color = '#555555';

      homeDom.style.borderLeft = '0 solid #6ebdf1';
      homeDom.style.backgroundColor = '#eeebeb';
      homeDom.style.color = '#555555';
    } else if (value === 'account') {
      setAcoountPage(true);
      setHomePage(false);
      setUserPage(false);
      setOtherPage(false);
      dataDom.style.borderLeft = '0 solid #6ebdf1';
      dataDom.style.backgroundColor = '#eeebeb';
      dataDom.style.color = '#555555';

      otherDom.style.borderLeft = '0 solid #6ebdf1';
      otherDom.style.backgroundColor = '#eeebeb';
      otherDom.style.color = '#555555';

      accountDom.style.borderLeft = '3px solid #6ebdf1';
      accountDom.style.backgroundColor = '#ffffff';
      accountDom.style.color = '#1C9BF0';

      homeDom.style.borderLeft = '0 solid #6ebdf1';
      homeDom.style.backgroundColor = '#eeebeb';
      homeDom.style.color = '#555555';

    } else if (value === 'home') {
      setHomePage(true);
      setAcoountPage(false);
      setUserPage(false);
      setOtherPage(false);
      dataDom.style.borderLeft = '0 solid #6ebdf1';
      dataDom.style.backgroundColor = '#eeebeb';
      dataDom.style.color = '#555555';

      otherDom.style.borderLeft = '0 solid #6ebdf1';
      otherDom.style.backgroundColor = '#eeebeb';
      otherDom.style.color = '#555555';

      accountDom.style.borderLeft = '0 solid #6ebdf1';
      accountDom.style.backgroundColor = '#fafafa';
      accountDom.style.color = '#555555';

      homeDom.style.borderLeft = '3px solid #6ebdf1';
      homeDom.style.backgroundColor = '#ffffff';
      homeDom.style.color = '#1C9BF0';
    }
  }
  return (
    <>

        <div>
            
          <div className="all-pages">    
          <div className="side-nav" style={{position: 'absolute',  top: '60px', left: '30px'}}>

          <Sidebar>
          <Menu id='side-menu'>
              <h4 style={{textAlign: 'center', padding: '10px 0',margin: '0', backgroundColor: '#1C9BF0', color: 'white'}}>Menu</h4>
              <div style={{height: '10px', backgroundColor: 'white'}}></div>

            <MenuItem
              id='menu-home'
              onClick={() => {handlePageChange('home')}}
              icon={<HomeIcon/>}
            > Home </MenuItem>

            <MenuItem
              id='menu-data'
              onClick={() => {handlePageChange('data')}}
              icon={<EqualizerIcon/>}
            > Data </MenuItem>

            <SubMenu label="Account" icon={<AccountCircleIcon/>}>
              <MenuItem 
                id='menu-account'
                style={{backgroundColor: '#fafafa'}}
                onClick={() => {handlePageChange('account')}}
                icon={<ManageAccountsIcon/>}
              > Settings </MenuItem>
              <MenuItem
                style={{backgroundColor: '#fafafa'}}  
                onClick={() => signOut()}
                icon={<LogoutIcon/>}
              > Sign out </MenuItem>
            </SubMenu>

            <MenuItem
              id='menu-other'
              onClick={() => {handlePageChange('other')}}
              icon={<MoreHorizIcon/>}
            > Other </MenuItem>
          </Menu>
        </Sidebar>
        </div>
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
          </div>

          {/* mobile */}
          <div className='bottom-nav'>
            <footer>
              <BottomNavigation  
                sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 , backgroundColor: '#f5f5f5'}} 
          
                value={value} 
                onChange={handleChange} 
                id="bottom-nav"
                showLabels
                >
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
        </div>
        </>
  );
}

export default App;
