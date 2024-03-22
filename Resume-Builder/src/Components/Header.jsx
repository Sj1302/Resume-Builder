/* eslint-disable */
import { Link } from "react-router-dom";
import logo from "../assets/assets//img/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import useUser from "../Hooks/useUser";
import { PuffLoader } from "react-spinners";
import React, { useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { FadeInandOut, SlideUpDownMenu } from "../Animations/animation";
import { auth } from "../firebase.config";
import { QueryClient, useQueryClient } from "react-query";
import { adminIds } from "../utils/helps";
import useFilters from "../Hooks/useFilters";
const Header = () => {
  const { data, isLoading, isError, refetch } = useUser();
  const [isMenu, setIsMenu] = useState(false);
  const queryClient = useQueryClient();
  const signoutuser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };
  const { data: filterData } = useFilters();
  const handleSearchTerm = (e) => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: e.target.value,
    });
  };
  const clearFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };
  return (
    <div className="top-0 sticky flex items-center justify-between w-full px-4 py-3 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 gap-12 ">
      <Link to={"/"}>
        <img src={logo} className="w-12 h-auto object-contain" alt="" />
      </Link>
      <div className="flex-1 rounded-md border border-gray-300 px-4 py-1 flex items-center justify-between bg-gray-200">
        <input
          type="text"
          value={filterData ? filterData.searchTerm : ""}
          onChange={handleSearchTerm}
          className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
          placeholder="Search Here"
        />
        <AnimatePresence>
          {filterData && filterData.searchTerm.length > 0 && (
            <motion.div
              {...FadeInandOut}
              onClick={clearFilter}
              className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer active:scale-95 duration-150"
            >
              <p className="text-2xl text-black cursor-pointer">x</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="#498FCD" size={40} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div onClick={() => setIsMenu(!isMenu)} {...FadeInandOut}>
                {data?.photoURL ? (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center">
                    <img
                      src={data?.photoURL}
                      className="w-full h-full object-cover rounded-md cursor-pointer"
                      referrerPolicy="no-referrer"
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 relative flex items-center justify-center rounded-md cursor-pointer bg-blue-600 shadow-md ">
                    <p className="text-3xl text-white">{data?.email[0]}</p>
                  </div>
                )}

                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      onMouseLeave={() => setIsMenu(false)}
                      {...SlideUpDownMenu}
                      className="absolute right-0 top-14 px-4 py-3 rounded-md bg-white flex flex-col items-center justify-start gap-3 w-64 pt-12"
                    >
                      {data?.photoURL ? (
                        <div className="w-20 h-20 rounded-full relative flex items-center justify-center">
                          <img
                            src={data?.photoURL}
                            className="w-full h-full object-cover rounded-full cursor-pointer"
                            referrerPolicy="no-referrer"
                            alt=""
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 relative flex items-center justify-center rounded-full cursor-pointer bg-blue-600 shadow-md ">
                          <p className="text-3xl text-white">
                            {data?.email[0]}
                          </p>
                        </div>
                      )}
                      {data?.displayName && (
                        <p className="text-lg text-txtDark">
                          {data?.displayName}
                        </p>
                      )}

                      <div className="flex flex-col w-full items-start gap-8 pt-6">
                        <Link
                          className="text-txtLight hover:text-txtDark whitespace-nowrap text-base"
                          to={`profile/${data?.uid}`}
                        >
                          My Account
                        </Link>
                        {adminIds.includes(data?.uid) && (
                          <Link
                            className="text-txtLight hover:text-txtDark whitespace-nowrap text-base"
                            to={"/template/create"}
                          >
                            Add New Template
                          </Link>
                        )}

                        <div
                          className="w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer"
                          onClick={signoutuser}
                        >
                          <p className="group-hover:text-txtDark text-txtLight ">
                            Sign Out
                          </p>
                          <LuLogOut className="group-hover:text-txtDark text-txtLight " />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button
                  {...FadeInandOut}
                  className="px-4 py-2 rounded-md border border-gray-200 bg-gray-200 hover:shadow-md active:scale-95 duration-150"
                  type="button"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
