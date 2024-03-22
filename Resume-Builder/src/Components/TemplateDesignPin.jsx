/* eslint-disable */
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { FadeInandOut, scaleInOut } from "../Animations/animation";
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from "react-icons/bi";
import { useState } from "react";
import useUser from "../Hooks/useUser";
import { saveToCollections, saveToFavourites } from "../api";
import useTemplates from "../Hooks/UseTemplates";
import { useNavigate } from "react-router-dom";
const TemplateDesignPin = ({ data, index }) => {
 const navigate = useNavigate();
 const {data:user, refetch: userRefetch} = useUser();
 const {refetch: template_Refetch} = useTemplates();
   const [isHovered, setIsHovered]= useState(false);
 const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();

  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    template_Refetch();
  };

  const HandleRouteNavigate= ()=>{
    navigate(`/resumeDetail/${data?._id}`, {replace: true});
  }

  return (
    <motion.div key={data?._id} {...scaleInOut(index)}>
      <div className="w-full h-[500px] 2xl:h-[740px] rounded-md bg-gray-200 overflow-hidden relative"
      onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} >
        <img
          src={data.imageURL}
          className="w-full h-full object-cover"
          alt=""
        />
        <AnimatePresence>
          {isHovered && <motion.div
            {...FadeInandOut}
            onClick={HandleRouteNavigate}
            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer"
          >
            <div className="flex flex-col items-end justify-start w-full gap-8">
              <InnerBoxCard
                label={user?.collections?.includes(data?._id) ? "Avl in Collections" : "Add To Collection" }
                Icon={user?.collections?.includes(data?._id) ? BiSolidFolderPlus : BiFolderPlus}
                onHandle={addToCollection}
              />
              <InnerBoxCard
                label={data?.favourites?.includes(user?.uid) ? "Avl in Favourites" : "Add To Favourites"}
                Icon={data?.favourites?.includes(user?.uid) ? BiSolidHeart : BiHeart}
                onHandle={addToFavourites}
              />
            </div>
          </motion.div>}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
    onMouseEnter={()=>setIsHovered(true)}
    onMouseLeave={()=>setIsHovered(false)}
      onClick={onHandle}
      className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative"
    >
      <Icon className="text-txtPrimary text-base" />
      <AnimatePresence>
        
          {isHovered && <motion.div className="px-3 py-2 rounded-md bg-gray-200 absolute -left-40 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45">
            <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
          </motion.div>}
       
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;
