import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import ClientList from "./Pages/ClientList/ClientList"
import AddNewClient from "./Pages/AddNewClient/AddNewClient"
import ClientView from "./Pages/ClientView/ClientView"
import LogIn from "./Pages/Login/Login"
import ProtectedRoute from "./utils/ProtectedRoute"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./services/firebase/firebaseConfig"

function App() {
  const [user,setUser] = useState(undefined)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(firebaseUser) => {
      setUser(firebaseUser)
    })

    return () => unsubscribe()
  },[])
  return (
   <Router>
    <Routes>
      <Route path="/login" element={<LogIn/>}/>
      <Route element={<ProtectedRoute  user={user}/>}>
          <Route path="/" element={<ClientList/>}/>
          <Route path="/add-client" element={<AddNewClient/>}/>
          <Route path="/client/:id" element={<ClientView/>}/>
      </Route>
      <Route path="/" element={<ClientList/>}/>
      <Route path="/add-client" element={<AddNewClient/>}/>
      <Route path="/client/:id" element={<ClientView/>}/>
    </Routes>
   </Router>
  )
}

export default App
