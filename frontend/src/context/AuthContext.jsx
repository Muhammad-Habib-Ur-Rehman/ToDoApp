import { useEffect, useState } from 'react';
import { createContext } from 'react';

export const AuthContext= createContext();

const AuthProvider=({children})=>{
  const[token, setToken]=useState(null);
  useEffect(()=>{
    const storedToken=localStorage.getItem("token")
    if(storedToken){
      setToken(storedToken);
    }

  },[]);

  const login=(newToken)=>{
    setToken(newToken);
    localStorage.setItem("token", newToken);
  
  }
const logout=()=>{
  setToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("loggedInUser");
}

return(
  <AuthContext.Provider value={{token,login,logout}}>
    {children}
  </AuthContext.Provider>
)
}
export default AuthProvider;