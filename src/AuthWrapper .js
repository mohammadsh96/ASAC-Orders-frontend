import React from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(['token', 'user']);

  const handleSignout = () => {
    removeCookie('token', { path: '/' });
    removeCookie('user', { path: '/' });
    navigate('/');
  };

  return (
    <div>
      {cookies.token !== '' ? (
        <nav>
          <ul>
            <li>
              <button onClick={handleSignout}>Sign Out</button>
            </li>
            {/* Other navigation items */}
          </ul>
        </nav>
      ) : (
        <nav>
          <ul>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
          </ul>
        </nav>
      )}

      {children}
    </div>
  );
};

export default AuthWrapper;
