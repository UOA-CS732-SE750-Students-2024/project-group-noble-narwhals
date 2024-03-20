import React from 'react'
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
<>
    <div>LoginPage</div>
    
    <Link to="/">Home</Link>

    <Link to="/group/1">GroupInfo</Link>
</>
    
  );
}

export default LoginPage