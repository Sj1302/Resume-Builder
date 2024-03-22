/* eslint-disable */
import { getTemplateDetails, saveToCollections, saveToFavourites } from "../api";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import MainSpinner from "../Components/MainSpinner";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../Hooks/useUser";
import useTemplates from "../Hooks/UseTemplates";
import { AnimatePresence } from "framer-motion";
import TemplateDesignPin from "../Components/TemplateDesignPin";

const TemplateDesignPinDetails = () => {
  const { templateID } = useParams();
  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: user_Refetch } = useUser();
  const { data: template_data, refetch: template_Refetch } = useTemplates();
  if (isLoading) return <MainSpinner />;

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    user_Refetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    template_Refetch();
    refetch();
  };

  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          An error occurred while fetching the data....
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-start px-4 py-12">
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data.name}</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        <div className="flex flex-col col-span-1 lg:col-span-8 gap-4 items-start justify-start">
          <img
            src={data?.imageURL}
            className="w-full h-auto object-contain rounded-md"
            alt=""
          />

          <div className="w-full flex flex-col gap-2 items-start justify-start">
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-txtPrimary font-semibold">
                {data?.title}
              </p>

              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-red-500 text-base" />
                  <p className="text-base text-txtPrimary font-semibold">
                    {data?.favourites?.length} likes
                  </p>
                </div>
              )}
            </div>

            {user && (
              <div className="flex items-center justify-center gap-3">
                {user?.collections?.includes(data?._id) ? (
                  <>
                    <div onClick={addToCollection} className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer">
                      <BiSolidFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove From Collections
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div onClick={addToCollection} className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer">
                      <BiFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add To Collections
                      </p>
                    </div>
                  </>
                )}



{data?.favourites?.includes(user?.uid) ? (
                  <>
                    <div onClick={addToFavourites} className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer">
                      <BiSolidHeart className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove From Favourites
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div onClick={addToFavourites} className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer">
                      <BiHeart className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add To Favourites
                      </p>
                    </div>
                  </>
                )}



              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col col-span-1 lg:col-span-4 w-full items-center justify-start px-3 gap-6">

                  <div className="w-full h-72 bg-blue-200 rounded-md overflow-hidden relative" style={{background:"url(https://cdn.pixabay.com/photo/2024/03/17/14/19/burst-8639022_1280.jpg)"}} >

                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                      <Link to={"/"} className="px-4 py-2 rounded-md border-2 border-gray-50 text-white">
                      Discover Here
                      </Link>
                    </div>

                  </div>
      

                  {user && (
                    <Link className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer" to={`/resume/${data?.name}?templateID:${templateID}`}>
                    <p className="text-white">Edit this Template</p>
                    </Link>
                  )}

                  <div className="w-full flex items-center justify-start flex-wrap gap-2">
                    {data?.tags?.map((tag,index)=>(
                      <p className="text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap" key={index}>{tag}</p>
                    ))}

                  </div>
          </div>
      </div>
      {template_data?.filter((temp)=>temp._id !== data?._id).length>0 && (
        <div className="w-full py-8 flex flex-col items-start justify-start gap-4">
          <p className="text-lg font-semibold text-txtDark">You might also like</p>
        
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">

          <AnimatePresence>
    {template_data?.filter((temp)=>temp._id !== data?._id).map((item, index) => (
            <TemplateDesignPin key={item?._id} data={item} index={index} />
          ))}
    </AnimatePresence>
          </div>
        </div>

       

      )}
    </div>
  );
};

export default TemplateDesignPinDetails;
