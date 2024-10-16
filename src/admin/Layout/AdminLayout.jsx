import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Listing from '../../Api/Listing';
import Header from "../compontents/Header"
import SideBar from '../compontents/SideBar';



export default function AdminLayout({ children }) {
  const [content, setContent] = useState([]);
  const fetchData = () => {
    const main = new Listing();
    const response = main.profile();
    response
      .then((res) => {
        if (res.data) {
          setContent(res.data.data);
        } else {
        }
      }).catch((error) => {
        localStorage && localStorage.removeItem("token");
        toast.error("Please log in first.");
      });
  }

  useEffect(() => {
    fetchData()
  }, []);


  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    fetchData(signal);
    return () => controller.abort();
  }, []);
  return (
    <div className='flex bg-black min-h-screen h-full p-[10px] md:p-[25px] pl-[10px] md:pl-[15px] xl:pl-[330px]'>

      <SideBar/>
      
      {children}


    </div>

  );
}

