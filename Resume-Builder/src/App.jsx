/* eslint-disable */
import { Suspense } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomeScreen from './Pages/HomeScreen'
import Authentication from './Pages/Authentication'
import { QueryClient, QueryClientProvider } from 'react-query' 
import {ReactQueryDevtools} from "react-query/devtools"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
function App() {
const queryclient= new QueryClient();
  return (
    <>
    <QueryClientProvider client={queryclient}>
    <Suspense fallback={<div>Loading</div>}>
      <Routes>
        <Route path='/*' element={<HomeScreen/>}/>
        <Route path='/auth' element={<Authentication/>}/>
      </Routes>
     </Suspense>
     <ToastContainer position='top-right' theme='dark'></ToastContainer>
     <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
    </>
  )
}

export default App
