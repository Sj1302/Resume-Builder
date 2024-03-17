import { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { FadeLoader, PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase.config";
import { adminIds, initialTags } from "../utils/helps";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../Hooks/UseTemplates";
import { useNavigate } from "react-router-dom";
import useUser from "../Hooks/useUser";

const CreateTemplate = () => {
  const [formData, setformData] = useState({
    title: "",
    imageURL: null,
  });
  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    url: null,
    progress: 0,
  });
  const [selectedTag, setSelectedTag]= useState([]);

  const {data:templates, isError:templateIsError, isLoading:templateIsLoading, refetch:templateRefetch}= useTemplates();

  const handleFileSelect = (e) => {
    setImageAsset((prev) => ({ ...prev, isImageLoading: true }));
    const file = e.target.files[0];
    if (file && isAllowed(file)) { 
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAsset((prev) => ({
            ...prev,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error("Error: Authorization Revoked");
          } else {
            toast.error(`Error : ${error.message}`);
          }
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURl) => {
                setImageAsset((prev)=> ({...prev, url:downloadURl,
                }))
            })
            toast.success("Image uploaded")
            setInterval(() => {
                setInterval(()=>{
                    setImageAsset((prev)=>({...prev, isImageLoading: false}))
                })
            }, 2000);
        }
      );
    } else {
      toast.info("Invalid File Format");
    }
  };
  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const pushToCloud= async()=>{
    const timestamp= serverTimestamp();
    const id=`${Date.now()}`;
    const _doc= {
        _id:id,
        timestamp:timestamp,
        imageURL:imageAsset.url,
        tags:selectedTag,
        name:templates && templates.length>0 ?`Template${templates.length+1}` : "Template1",
        title:formData.title,

    }
    await setDoc(doc(db,"templates", id), _doc).then(()=>{
        setformData((prev)=> ({...prev, title:"", imageURL:""}));
        setImageAsset((prev)=>({...prev, url:null}))
        setSelectedTag([]);
        templateRefetch();
        toast.success("Data Added Successfully");
    }).catch(error => toast.error(`Error: ${error.message}`))
  }
  const deleteAnImageObject = async ()=>{
    
    // setImageAsset((prev)=>({...prev, isImageLoading:true}))
    setInterval(()=>{
        setImageAsset((prev)=>({...prev, 
            progress:0,
            url:null,
            isImageLoading:false}))
    },2000)
    const deleteRef = ref(storage, imageAsset.url)
    deleteObject(deleteRef).then(() =>{
        toast.success("Image Deleted Successfully");
       
    })
  }

  const handleSelectedTags= (tag)=>{
    if(selectedTag.includes(tag)){
        setSelectedTag(selectedTag.filter((item)=> item!=tag))
    }
    else{
        setSelectedTag([...selectedTag,tag])
    }
  }
  const navigate = useNavigate();
  const {data:user, isLoading}= useUser();
  useEffect(()=>{
if(!isLoading && !adminIds.includes(user?.uid) ){
    navigate("/", {replace:true});
}
  },[user,isLoading ])

  const removeTemplate= async(template)=>{
    const deleteRef= ref(storage, template?.imageURL);
    await deleteObject(deleteRef).then(async ()=>{
        await deleteDoc(doc(db,"templates",template?._id)).then(()=> {
            toast.success("Template Deleted Successfully");
            templateRefetch();
        }).catch((err)=> {
            toast.error(err.message);
        })
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* {left container} */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className="w-full">
          <p className="text-lg text-txtPrimary ">Create a new Template</p>
        </div>
        {/* {section tag} */}
        <div className="w-full flex items-center justify-end">
          <p className="text-base text-txtLight uppercase font-semibold">
            TempID:
          </p>
          <p className="text-sm text-txtDark capitalize font-bold">{templates && templates.length>0 ?`Template${templates.length+1}` : "Template1" }</p>
        </div>
        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"
          name="title"
          type="text"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
        />

        <div className="flex items-center justify-center w-full bg-gray-100 border-2 border-dotted border-gray-300 cursor-pointer backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md">
          {imageAsset.isImageLoading ? (
            <>
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader color="#498FCD" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </>
          ) : (
            <>
              {!imageAsset?.url ? (
                <>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-txtLight">Click to upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </>
              ) : (
                <>
                <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img src={imageAsset?.url} className="w-full h-full object-cover" loading="lazy" alt="" />

                    <div onClick={deleteAnImageObject} className="absolute w-8 h-8 top-4 right-4 flex items-center justify-center bg-red-500 cursor-pointer" >
                        <FaTrash className="text-sm text-white"/>
                    </div>
                </div>
                </> 
              )}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center w-full gap-2">
            {initialTags.map((item,index)=>(
                <div className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${selectedTag.includes(item) ? "bg-blue-500 text-white" : ""} `}  key={index} onClick={()=>handleSelectedTags(item)} >
                    <p className="text-xs">{item}</p>
                </div>
            ))}

        </div>
        <button type="button" className="w-full bg-blue-700 text-white rounded-md py-3" onClick={pushToCloud}> Save</button>
      </div>
      {/* {right container} */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 flex-1 px-2 py-4">

                {templateIsLoading ? 
                (<>
                <div className="w-full h-full flex items-center justify-center">
                <FadeLoader color="#36d7b7" size={80}/>
                </div>
                </>)
                :
                (<>
                
                {templates && templates.length>0 ? (<>
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">  
                    {templates?.map((template)=>(
                        <div className="w-full h-[500px] rounded-md overflow-hidden relative" key={template._id}>
                        <img src={template?.imageURL} alt="" className="w-full h-full object-cover" />
                        <div onClick={()=>removeTemplate(template)} className="absolute w-8 h-8 top-4 right-4 flex items-center justify-center bg-red-500 cursor-pointer" >
                        <FaTrash className="text-sm text-white"/>
                    </div>
                        </div>
                    ))}
                    
                </div>
                </>)
                :
                (<>
                <div className="w-full h-full flex  flex-col gap-3 items-center justify-center">
                <FadeLoader color="#36d7b7" />
                <p className="text-txtDark text-2xl">No Data</p>
                </div>
                </>)}
                </>)}
        
      </div>
    </div>
  );
};

export default CreateTemplate;
