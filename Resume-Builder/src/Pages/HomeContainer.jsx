/* eslint-disable */
import { AnimatePresence } from "framer-motion";
import Filter from "../Components/Filter"
import MainSpinner from "../Components/MainSpinner"
import useTemplates from "../Hooks/UseTemplates";
import TemplateDesignPin from "../Components/TemplateDesignPin";

const HomeContainer = () => {
  const {data:templates, isLoading: temp_isLoading, isError: temp_isError, refetch:temp_refetch} = useTemplates();
  
  if(temp_isLoading){
    return <MainSpinner />
  }
  console.log(templates,"qwertyu");
  return (
    <div className="w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
      <Filter/>

      {temp_isError ? 
      (<>
      <p className="text-lg text-txtDark">
        Something went wrong... Please try again later
      </p>
      </>) 
      : 
      (<>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
          <RenderATemplate templates={templates}/>
      </div>
      </>)}
    </div> 
  )
}

const RenderATemplate = ({ templates }) =>{
  return (
    <>
    {templates && templates.length > 0 ? 
    (<>
    <AnimatePresence>
    {templates.map((item, index) => (
            <TemplateDesignPin key={item?._id} data={item} index={index} />
          ))}
    </AnimatePresence>
    </>)
    : 
    (<>
    <p>
    No Data found
    </p></>)}
    </>
  )

}

export default HomeContainer
