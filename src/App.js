import {Outlet,Navigate,Route,Routes,useLocation,Link}from 'react-router-dom' 
import {Home , Login, Profile, Register, ResetPassword } from "./pages"
import { useSelector } from 'react-redux';


function Layout() {

  // USER AUTHENCTICATON 

const {user} = useSelector(state=>state.user);
const locatoin = useLocation();

// if user exist then , child component will be rendered else will be navigated to the login page and with a special prop replace  
return user?.token?(<Outlet/>):(<Navigate to='/login' state={{from : locatoin}} replace/>)

}

function App() {
  const {theme }= useSelector(state=>state.theme)
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
     <Routes>
      <Route element={<Layout/>}>    
         {/* Home Route  */}
         <Route path='/' element={<Home/>}></Route>
         {/* Profile Route */}
         <Route path='/profile/:id?' element={<Profile/>}></Route>
      </Route>
       {/* Register Route */}
      <Route path='/register' element={<Register/>}></Route>
      {/* Login Route */}
      <Route path='/login' element={<Login/>}></Route>
      {/* ResetPassword Route */}
      <Route path='/reset-password' element={<ResetPassword/>}></Route>
     </Routes>
    </div>
  );
}

export default App;
