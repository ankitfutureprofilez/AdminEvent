import React, { useState } from 'react'
import { IoMdSearch } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { HiOutlineMenu } from "react-icons/hi";
import SideBar from './SideBar';

export default function Header({title}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
<>
<div className='sticky z-[1] top-0 mb-[20px] flex items-center justify-between gap-[5px] md:gap-[20px]  w-full bg-[#1B1B1B] p-[10px] md:p-[20px]  rounded-[10px] md:rounded-[15px]'>
  <div className='flex items-center w-full gap-[5px] md:gap-[20px]'>
    <button
      onClick={toggleSidebar}
      className="text-white xl:hidden"
    >
      <HiOutlineMenu size={32} />
    </button>
    <h2 className='text-white font-manrope font-[500] md:text-[25px] lg:text-[25px] xl:text-[32px] pr-[70px] hidden md:block'>{title? title  :"Dashboard"}</h2>
    <div className='relative w-full max-w-[370px]'>
      <IoMdSearch className='absolute top-[15px] left-[15px] text-white' />
      <input className='w-full bg-[#1B1B1B] border border-[#37474F] p-[10px] pl-[40px] rounded-[50px] text-white text-[15px]' type="text" placeholder='Search.....' />
    </div>
  </div>
  <div className=''>
    <Link className='flex items-center justify-center w-[30px] h-[30px] md:w-[50px] md:h-[50px] bg-[#ffffff0d] rounded-[80px]'>
      <FaUser className='text-white text-[10px] md:text-[15px]' />
    </Link>
  </div>
</div>
  {isOpen && <SideBar toggleSidebar={toggleSidebar} isOpen={isOpen} setIsOpen={setIsOpen} />}
</>

  )
}
