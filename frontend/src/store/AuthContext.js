import React, {createContext, useContext, useState, useEffect} from 'react'

const AuthContext = createContext(null);


function AuthContext() {
  return (
    <div>AuthContext</div>
  )
}

export default AuthContext