import React, { useEffect, useState } from "react";
import Header from "../compontents/Header";
import Filter from "./Filter";
import Listing from "../../Api/Listing";
import toast from "react-hot-toast";
import Delete from "../compontents/Delete";
import LoadingSpinner from "../compontents/LoadingSpinner";
import NoDataPage from "../compontents/NoDataPage";

export default function UserList() {
  const [listing, setLisitng] = useState("");
  const [Loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const users = () => {
    setLoading(true);
    const main = new Listing();
    main
      .profile(page, limit)
      .then((r) => {
        setLoading(false);
        setLisitng(r?.data?.data);
      })
      .catch((err) => {
        setLoading(false);
        setLisitng([]);
        console.log("error", err);
      });
  };

  useEffect(() => {
    users(page);
  }, []);

  const handleActiveStatues = (Id, status) => {
    setLoading(true);
    const main = new Listing();
    const response = main.userupdatedstatus({ _id: Id, user_status: status });
    response
      .then((res) => {
        if (res && res?.data?.status) {
          toast.success(res.data.message);
          users(page);

        } else {
          toast.error(res.data?.message || "Something went wrong.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error?.response?.data?.message);
        toast.error(error?.response?.data?.message || "An error occurred.");
        setLoading(false);
      });
  };
  return (
    <div className="w-full max-w-[100%]">
      <Header title={"All Users"} />
      <div className="w-full  bg-[#1B1B1B] p-[10px] md:p-[25px] rounded-[10px] md:rounded-[20px] mt-[15px]">
        <Filter />
        {Loading ? (
          <LoadingSpinner />
        ) : (

          <div className="overflow-auto">
            <table className="w-full table-auto whitespace-nowrap">
              <thead className="mb-[15px]">
                <tr>
                  <th className="border-b border-[#ffffff59] font-manrope text-[14px] text-[#ffffff59] uppercase text-left p-[10px] mb-[10px]">
                    S.No.
                  </th>
                  <th className="border-b border-[#ffffff59] font-manrope text-[14px] text-[#ffffff59] uppercase text-left p-[10px] mb-[10px] text-center ">
                    Username
                  </th>
                  <th className="border-b border-[#ffffff59] font-manrope text-[14px] text-[#ffffff59] uppercase text-center p-[10px]">
                    Email
                  </th>
                  <th className="border-b border-[#ffffff59] font-manrope text-[14px] text-[#ffffff59] uppercase text-center p-[10px]">
                    city
                  </th>
                  <th className="border-b border-[#ffffff59] font-manrope text-[14px] text-[#ffffff59] uppercase text-center p-[10px]">
                    Address
                  </th>
                  <th className="border-b border-[#ffffff59] font-manrope text-[14px] text-[#ffffff59] uppercase text-center p-[10px]">
                    Contact
                  </th>
                  <th className="border-b border-[#ffffff59] font-manrope text-[14px] text-[#ffffff59] uppercase text-center p-[10px]">
                    Delete
                  </th>
                  <th className="border-b border-[#ffffff59] font-manrope text-[14px] text-[#ffffff59] uppercase text-center p-[10px]">
                    Action
                  </th>
                </tr>
              </thead>
              {listing?.users === 0 ? (
                <NoDataPage />
              ) : (
                listing &&
                listing?.users &&
                listing?.users?.map((item, index) => (
                  <tr key={index}>
                    <td className="font-manrope font-[600] text-white text-[16px] text-left px-[10px] py-[16px] border-b border-[#ffffff1a]">
                      {index + 1}
                    </td>

                    <td className="font-manrope font-[600] text-white text-[16px] text-left px-[10px] py-[16px] border-b border-[#ffffff1a] text-center">
                      {item?.username}
                    </td>
                    <td className="font-manrope font-[600] text-white text-[16px] text-left px-[10px] py-[16px] border-b border-[#ffffff1a] text-center">
                      {item?.email}
                    </td>
                    <td className="font-manrope font-[600] text-white text-[16px] text-left px-[10px] py-[16px] border-b border-[#ffffff1a] text-center">
                      {item?.city}
                    </td>
                    <td className="font-manrope font-[600] text-white text-[16px] text-left px-[10px] py-[16px] border-b border-[#ffffff1a] text-center">
                      {item?.address}
                    </td>
                    <td className="font-manrope font-[600] text-white text-[16px] text-left px-[10px] py-[16px] border-b border-[#ffffff1a] text-center">
                      {item?.phone_number}
                    </td>
                    <td className="font-manrope font-[600] text-white text-[16px] text-left px-[10px] py-[16px] border-b border-[#ffffff1a] text-center">
                      <Delete Id={item?._id} step={2} users={users} />
                    </td>
                    <td className="font-manrope font-[600] text-white text-[16px] text-left px-[10px] py-[16px] border-b border-[#ffffff1a] text-center">
                      <button
                        onClick={() => handleActiveStatues(item?._id, item?.user_status)} // Updated to use arrow function
                        className={`capitalize min-w-[110px] m-auto border font-[manrope] font-[600] text-[16px] text-center px-[15px] py-[6px] rounded-[60px] 
                                           ${item?.user_status === 'active'
                            ? 'border-[#4CAF50] bg-[#4CAF501A] text-[#4CAF50]'
                            : 'border-[#FF0000] bg-[#FF00001A] text-[#FF0000]'}`}
                      >
                        {item?.user_status}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
