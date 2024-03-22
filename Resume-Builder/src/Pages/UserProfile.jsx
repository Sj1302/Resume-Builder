/* eslint-disable */
import { AnimatePresence } from "framer-motion";
import useTemplates from "../Hooks/UseTemplates";
import useUser from "../Hooks/useUser"
import { useEffect, useState } from "react";
import TemplateDesignPin from "../Components/TemplateDesignPin";
import { FaSearchPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";
import MainSpinner from "../Components/MainSpinner";

const UserProfile = () => {
  const {data}= useUser();
  const [activeTab, setActiveTab]= useState("collections");
  const {data:templates, isLoading:templ_isLoading, isError:temp_isError, refetch:temp_Refetch}= useTemplates();
const navigate= useNavigate();
  useEffect(()=>{
    if(!data){
      navigate("/auth", {replace: true});
    }
  },[])
  const {data:savedResumes}= useQuery(["savedResumes"], ()=> getSavedResumes(data?.uid));
  
  if(templ_isLoading){
    return <MainSpinner/>
  }
  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full h-72">
      <img src="https://plus.unsplash.com/premium_photo-1664803966184-ab1a6d9e0fc4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXJ8ZW58MHx8MHx8fDA%3D" alt=""  className="w-full h-full object-cover"/>

     <div className="flex items-center justify-center flex-col gap-4">
     {data?.photoURL ? (
                        
                          <img
                            src={data?.photoURL}
                            className="w-24 h-24  rounded-full border-2 border-white -mt-12 shadow-md "
                            referrerPolicy="no-referrer"
                            alt=""
                          />
                      ) : (
                        
                           <img
                            src="https://img.freepik.com/free-photo/3d-illustration-cute-boy-wearing-cap-glasses_1142-43263.jpg?t=st=1711085149~exp=1711088749~hmac=7f90b5220ad132df574a856590c151607cf7739885c4c7d1e99aa71a924c948f&w=740"
                            className="w-24 h-24  rounded-full border-2 border-white -mt-12 shadow-md object-cover"
                            referrerPolicy="no-referrer"
                            alt=""
                          />
                      )}
                      <p className="text-2xl text-txtDark">{data?.displayName}</p>
     </div>
     <div className="flex items-center justify-center mt-12">
      <div className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`} onClick={()=>setActiveTab("collections")}>
        <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab==="collections" && "bg-white shadow-md text-blue-600"} `}>Collections</p>

      </div>
      <div className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`} onClick={()=>setActiveTab("resumes")}>
        <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab==="resumes" && "bg-white shadow-md text-blue-600"} `}>My Resumes</p>

      </div>


     </div>

     <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
      <AnimatePresence >
          {activeTab==="collections" && <>
          {data?.collections.length>0 && data?.collections ? <RenderATemplate templates={templates?.filter((item)=>data?.collections.includes(item?._id))}/>: <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
          <FaSearchPlus/>
          <p>No Data</p>
            </div>}
          </>}

          {activeTab==="resumes" && <>
          {savedResumes?.length>0 && savedResumes? <RenderATemplate templates={savedResumes}/>: <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
          <FaSearchPlus/>
          <p>No Data</p>
            </div>}
          </>}

      </AnimatePresence>
     </div>

      </div>
     
    </div>
  )
}

const RenderATemplate = ({ templates }) =>{
  return (
    <>
    {templates && templates.length > 0 && 
    (<>
    <AnimatePresence>
    {templates.map((item, index) => (
            <TemplateDesignPin key={item?._id} data={item} index={index} />
          ))}
    </AnimatePresence>
    </>)
   }
    </>
  )

}

export default UserProfile
