import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

// user -> true | false
// login() -> setUser(true)
// logout() -> setUser(false)

const decodeJWT = (token) => {
  try {
    const base64PayLoad = token.split(".")[1];
    const payload = atob(base64PayLoad.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem("token")
  const [token, setToken] = useState(savedToken || null)
  // 1 - Si tengo token, tengo usuario
  // 2 - Descifrar el payload del token
  const [user, setUser] = useState(() => savedToken ? decodeJWT(savedToken) : null)

  const login = (token) => {
    localStorage.setItem("token", token)
    setToken(token)
    setUser(decodeJWT(token))
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }