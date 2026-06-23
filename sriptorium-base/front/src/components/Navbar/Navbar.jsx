
import './Navbar.css';
import Button from '../Button/button';
import { Link } from 'react-router-dom';
const Navbar=({logo, menuItem})=>{
  return(
    <nav className='navbar'>
      {/*logo*/}
      <div className='nav-logo'>
        {logo||<span className='logo-text'></span>}

      </div>
      <div className='nav-menu'>
         {menuItem && menuItem.map((item, index) => (
          <Link
            key={index} 
            to={item.path} 
            className="nav-link"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className='nav-actions'>
        <button variant="outline" className="login-btn">Login</button>
        <button variant="primary" className="signup-btn">Sing up</button>
      </div>

    </nav>

  );
};

export default Navbar;