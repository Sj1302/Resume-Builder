/* eslint-disable */
import { GithubAuthProvider, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { FaChevronRight } from "react-icons/fa"
import { auth } from "../firebase.config";


const AuthenticationButtonProvider = ({Icon, label, provider}) => {

  const googleprovider = new GoogleAuthProvider();
  const githubprovider = new GithubAuthProvider();
  const handleClick=async ()=>{
    
    switch(provider){
      case 'GoogleAuthProvider':
        try{
          const res= await signInWithRedirect(auth, googleprovider);
          console.log(res);

        }
        catch(err){
          console.log(err);
        }
        break;
      case "GitHubAuthProvider":
        try{
          const res= await signInWithRedirect(auth, githubprovider);
          console.log(res);

        }
        catch(err){
          console.log(err);
        }
        break;
        default:
          try{
            const res= await signInWithRedirect(auth, googleprovider);
            console.log(res);
  
          }
          catch(err){
            console.log(err);
          }
          break;
    }
  }
  return (
    <div onClick={handleClick} className="flex items-center justify-between w-full px-4 py-3 rounded-md border-2 border-blue-600  cursor-pointer group hover:bg-blue-600 active:scale-95 duration-150 hover:shadow-md">
      <Icon className="text-txtPrimary text-xl group-hover:text-white"/>
      <p className="text-txtPrimary text-lg group-hover:text-white">{label}</p>
      <FaChevronRight className="text-txtPrimary text-base group-hover:text-white" />
    </div>
  )
}

export default AuthenticationButtonProvider
