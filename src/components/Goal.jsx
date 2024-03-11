import React, { useEffect, useState } from 'react'
import { getDatabaseInfo } from '../database/getDatabaseInfo';

const Goal = () => {
  const style = {
    width: '65vw',
    maxWidth: '400px',
    height: 'auto',
    textAlign: 'center',
    padding: '15px',
    boxShadow: "0 5px 25px 0 rgba(160, 160, 160, 0.522)",
    // border: '1px solid #cecece6e',
    backgroundColor: "#fff1d6b7",
    display: 'none',
    marginTop: '2vh',
    marginBottom: '10vh',
    position: 'relative'
  }
  const [goal, setGoal] = useState(null);
  useEffect(() => {
    getDatabaseInfo().then((data) => {
      setGoal(data.goal);
    })
  }, []);

  return (
    <>
      {
        goal ? (
          <div style={style} id="goal">
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: "translateY(-50%)", fontSize: '1.7em' }}>⭐️</span>{goal}
          </div>
        ) : (
          null
        )
      }
    </>
  )
}

export default Goal
