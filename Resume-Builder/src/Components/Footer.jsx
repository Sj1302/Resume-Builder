import { Link } from "react-router-dom"
import logo from "../assets/assets/img/logo.png"
const Footer = () => {
  return (
    <div className="flex items-center justify-between w-full ">
      <div className="flex items-center justify-center gap-3">
      <img className="w-8 h-auto object-contain" src={logo} alt="" />
      <p>Expressume</p>
      </div>

    <div className="flex gap-5 items-center justify-center whitespace-nowrap">
        <Link className="text-sm text-blue-600" to={"/"}>Home</Link>
        <Link className="text-sm text-blue-600" to={"/"}>Contact</Link>
        <Link className="text-sm text-blue-600" to={"/"}>Privacy Policy</Link>
        
    </div>
    </div>
  )
}

export default Footer
