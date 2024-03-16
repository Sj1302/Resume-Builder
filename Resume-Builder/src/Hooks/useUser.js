/* eslint-disable */
import { useQuery } from "react-query"
import { toast } from "react-toastify";
import { getUserDetail } from "../api";

const useUser= ()=>{
    const{data, isLoading, isError, refetch}= useQuery(
        "user", 
        async ()=>{
           try{
            const useDetail= await getUserDetail();
            return useDetail;  
           }
           catch(err){
            if(!err.message.includes("not authenticated")){
                toast.err("Something went wrong")
            }
           }
        },
        {refetchOnWindowFocus: false}
    )
    return {data, isLoading, isError, refetch}
}

export default useUser;