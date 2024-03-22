import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react"
import {MdLayersClear} from "react-icons/md"
import { slideUpDownWithScale } from "../Animations/animation";
import { FiltersData } from "../utils/helps";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import useFilters from "../Hooks/useFilters";
const Filter = () => {
const [isClearHovered, setIsClearHovered]= useState(false);

const {data: filterData, isLoading, isError, refetch}= useFilters();

const queryClient=useQueryClient();

const handleFilterValue= (val)=>{
    queryClient.setQueryData("globalFilter", {...queryClient.getQueryData("globalFilter"),searchTerm: val,
});
};
const clearFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };

  return (
    <div className="w-full flex items-center justify-start py-4">
      <div onClick={clearFilter} className="border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 relative" 
      onMouseLeave={()=>setIsClearHovered(false)}
      onMouseEnter={()=>setIsClearHovered(true)}>
        <MdLayersClear  className="text-xl"/>

        <AnimatePresence>
            {isClearHovered && (
                <motion.div  {...slideUpDownWithScale}
                className="absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1">
                <p className="whitespace-nowrap text-xs">Clear all</p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
      <div className="w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
        {FiltersData && FiltersData.map((item)=>(
            <div onClick={()=>handleFilterValue(item.value)} key={item.id} className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md ${filterData && filterData.searchTerm === item.value && "bg-gray-300 shadow-md"} `}>
                <p className="text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap">{item.value}</p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default Filter
