import React from 'react'
import { getAuth, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../database/firebase'

const AccountDeleteBtn = () => {
  

  
  const deleteAccount = () => {
    const result = window.confirm('すべてのデータが完全に失われます。本当にアカウントを削除しますか？');
    if (result) {
      const auth = getAuth();
      const user = auth.currentUser;
      
      deleteUser(user).then(() => {
        deleteDoc(doc(db, 'users', user.uid));
      }).then(() => {
        window.location.href = '/account-delete';
      }).catch((error) => {
        window.location.href = '/error';
        console.error(error);
      });
    }
    
  }

  return (
    <>
        <div onClick={() => {deleteAccount()}} style={{fontSize: '20px', color: 'red' ,width: '100px',margin: '10vw auto', backgroundColor: 'white', borderRadius: '15px',cursor: 'pointer', border: '2px solid gray'}}>削除</div>
    </>
  )
}

export default AccountDeleteBtn