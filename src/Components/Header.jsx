import React from 'react'

function Header() {

    const linkStyle = {
        color: 'black',
        fontWeight: 'bold',
        textDecoration: 'none',
        marginRight: '1rem'
      };

  return (
    <div className="container-fluid" style={{background:"none"}}>
        <div className="navbar" style={{ paddingBottom: '5vh' }}>
          <div className="container-fluid">
            <h1 className='ps-4 pt-4' style={{fontSize:"70px"}}><span style={{fontFamily:"Protest Strike"}}>On</span><span style={{fontFamily:"Pacifico"}}>-Demand</span></h1>
            <div className="navbar-links">
              <a href="#about" style={linkStyle}>About Us</a>
              <a href="#contact" style={linkStyle}>Contact </a>
            </div>
          </div>
        </div>
        </div>
  )
}

export default Header