import { MdCake } from "react-icons/md";
import { Link } from "react-router-dom";
import { AiOutlineDash } from "react-icons/ai";

function Package() {
    return (
        <div className="w-full  bg-[#1B1B1B] rounded-[20px]">
            <h2 className="font-manrope font-[600] text-white text-[18px] md:text-[24px] mb-[15px]">Packages</h2>
            <div className="flex items-center justify-between gap-[10px] w-full border border-[#404040] rounded-[10px] p-[15px] mb-[15px]">
                <div className="flex items-center gap-[13px] w-[90%] ">
                    <div className="flex gap-[10px] items-center justify-center rounded-[5px] w-[38px] h-[38px] 
                    md:w-[40px] md:h-[40px] lg:w-[45px] lg:h-[45px] xl:w-[60px] xl:h-[60px] bg-[#302F2F]">
                        <MdCake className="text-[#EB3465] text-[25px]" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-manrope text-white text-[18px] leading-[18px] md:text-[18px] md:leading-[18px] lg:text-[20px] lg:leading-[20px] xl:text-[22px] xl:leading-[22px]">Birthday party</h2>
                        <div>
                            <span className="font-manrope text-[#ffffff59] text-[600] uppercase text-[11px] leading-[22px] mr-[8px]">Catering ,</span>
                            <span className="font-manrope text-[#ffffff59] text-[600] uppercase text-[11px] leading-[22px]">Activity</span>
                        </div>
                    </div>
                </div>

                <div className="w-[10%] text-center flex items-center justify-center">
                    <Link to={"/"}>
                    <AiOutlineDash className="text-white text-[20px]" />
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-between gap-[10px] w-full border border-[#404040] rounded-[10px] p-[15px] mb-[15px]">
                <div className="flex items-center gap-[13px] w-[90%] ">
                    <div className="flex gap-[10px] items-center justify-center rounded-[5px] w-[38px] h-[38px] 
                    md:w-[40px] md:h-[40px] lg:w-[45px] lg:h-[45px] xl:w-[60px] xl:h-[60px] bg-[#302F2F]">
                        <MdCake className="text-[#EB3465] text-[25px]" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-manrope text-white text-[18px] leading-[18px] md:text-[18px] md:leading-[18px] lg:text-[20px] lg:leading-[20px] xl:text-[22px] xl:leading-[22px]">Birthday party</h2>
                        <div>
                            <span className="font-manrope text-[#ffffff59] text-[600] uppercase text-[11px] leading-[22px] mr-[8px]">Catering ,</span>
                            <span className="font-manrope text-[#ffffff59] text-[600] uppercase text-[11px] leading-[22px]">Activity</span>
                        </div>
                    </div>
                </div>

                <div className="w-[10%] text-center flex items-center justify-center">
                    <Link to={"/"}>
                    <AiOutlineDash className="text-white text-[20px]" />
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-between gap-[10px] w-full border border-[#404040] rounded-[10px] p-[15px] mb-[15px]">
                <div className="flex items-center gap-[13px] w-[90%] ">
                    <div className="flex gap-[10px] items-center justify-center rounded-[5px] w-[38px] h-[38px] 
                    md:w-[40px] md:h-[40px] lg:w-[45px] lg:h-[45px] xl:w-[60px] xl:h-[60px] bg-[#302F2F]">
                        <MdCake className="text-[#EB3465] text-[25px]" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-manrope text-white text-[18px] leading-[18px] md:text-[18px] md:leading-[18px] lg:text-[20px] lg:leading-[20px] xl:text-[22px] xl:leading-[22px]">Birthday party</h2>
                        <div>
                            <span className="font-manrope text-[#ffffff59] text-[600] uppercase text-[11px] leading-[22px] mr-[8px]">Catering ,</span>
                            <span className="font-manrope text-[#ffffff59] text-[600] uppercase text-[11px] leading-[22px]">Activity</span>
                        </div>
                    </div>
                </div>

                <div className="w-[10%] text-center flex items-center justify-center">
                    <Link to={"/"}>
                    <AiOutlineDash className="text-white text-[20px]" />
                    </Link>
                </div>
            </div>
        </div>);
}

export default Package;