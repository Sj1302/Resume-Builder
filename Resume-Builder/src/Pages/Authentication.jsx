/* eslint-disable */
import { useNavigate } from "react-router-dom";
import AuthenticationButtonProvider from "../Components/AuthenticationButtonProvider"
import Footer from "../Components/Footer"
import useUser from "../Hooks/useUser";
import logo from "../assets/assets//img/logo.png"
import { FaGoogle } from "react-icons/fa";
import { FaGithubAlt } from "react-icons/fa6";
import { useEffect } from "react";
import MainSpinner from "../Components/MainSpinner";
const Authentication = () => {

  const {data, isLoading, isError, refetch} = useUser();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!isLoading && data){
      navigate("/", {replace: true});
    } 
  }, [isLoading,data])

  if(isLoading){
    return <MainSpinner/>
  }

  return (
    <div className="auth-section">
      <img src={logo} className="w-12 h-auto object-contain" alt="" />
      <div className="w-full flex flex-col items-center justify-center flex-1 gap-2">
        <h1 className="text-blue-600 text-3xl lg:text-4xl">Welcome to Expressume</h1>
        <p className="text-gray-500 text-base">express way to create resume</p>
        <h2 className="text-2xl text-gray-600">Authenticate</h2>
        <div className="flex flex-col gap-2 w-1/4 ">
            <AuthenticationButtonProvider Icon={FaGoogle} label={"Signin with Google"} provider={"GoogleAuthProvider"}/>
            <AuthenticationButtonProvider Icon={FaGithubAlt} label={"Signin with GitHub"} provider={"GitHubAuthProvider"}/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Authentication
