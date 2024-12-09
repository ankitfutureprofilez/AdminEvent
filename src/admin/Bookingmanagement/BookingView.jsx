import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import Listing from "../../Api/Listing";
import toast from "react-hot-toast";
import ViewImage from "../../asstes/event.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../compontents/LoadingSpinner";
import Header from "../compontents/Header";
import { IoIosArrowBack } from "react-icons/io";
import { FaDollarSign, FaEdit, FaEuroSign, FaPoundSign } from "react-icons/fa";
import { TbCurrencyDirham } from "react-icons/tb";
import { FaPhoneAlt } from "react-icons/fa";
import { BsFillTelephoneForwardFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

import VenuePhotos from "./VenuePhotos";
export default function BookingView() {
  const currencySymbol = {
    USD: <FaDollarSign size={18} className="inline" />,
    EUR: <FaEuroSign size={18} className="inline" />,
    AED: <TbCurrencyDirham size={18} className="inline" />,
    GBP: <FaPoundSign size={18} className="inline" />,
  };
  const [currencyprice, setCurrencyPrice] = useState("");
  const currencies = ["USD", "AED", "GBP", "EUR"];

  const [currency, setCurrency] = useState("AED"); // Default currency
  console.log("currency", currency)
  const [price, setPrice] = useState(""); // Price input
  const { Id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState("");
  console.log("item", item)
  const fetchData = async () => {
    setLoading(true);
    try {
      const main = new Listing();
      const response = await main.BookingGetID(Id);
      setItem(response?.data?.data);
      setPrice(response?.data?.data?.totalPrice)
      setAttend(response?.data?.data?.attendees)
      setCurrency(response?.data?.data?.CurrencyCode)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (Id) {
      fetchData(Id);
    }
  }, [Id]);

  const [loading, setLoading] = useState(false);

  const [attend, setAttend] = useState("")

  const handleActiveStatues = (Id, status) => {
    if (!Id || !status) {
      toast.error("Invalid ID or status. Please check your input.");
      return;
    }
    if (!price) {
      toast.error("Please Enter Price");
      return;
    }
    setLoading(true);
    const main = new Listing();
    const response = main.BookingStatus({ _id: Id, status: status, attendees: attend, CurrencyCode: currency });
    response
      .then((res) => {
        fetchData(res?.data?.data?._id);
        if (res && res?.data) {
          handlePriceChange();
          toast.success(res.data.message);
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



  const handlepayment = (Id) => {
    if (!Id) {
      toast.error("Invalid ID or status. Please check your input.");
      return;
    }
    setLoading(true);
    const main = new Listing();
    const response = main.BookingPayment({
      _id: Id,
      payment_genrator_link: true,
    });
    response
      .then((res) => {
        fetchData(res?.data?.data?._id);
        if (res && res?.data?.status) {
          toast.success(res.data.message);
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



  const [payment, setpayment] = useState("")

  const fechtpaymentdata = async () => {
    setLoading(true);
    try {
      const main = new Listing();
      const response = await main.paymentgetid(Id);
      setpayment(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (Id) {
      fechtpaymentdata(Id);
    }
  }, [Id]);


  const [inputs, setInputs] = useState(
    item?.package?.map(venue => ({
      id: venue.place_id,
      price: venue.services_provider_price * currencyprice || venue.price_level * currencyprice || ""
    })) || []
  );
  let pricelevel = null
  const totalPriceLevel = item?.package?.reduce((total, venue) => {
    if (venue?.price_level) {
      pricelevel = total + (venue?.price_level ? parseFloat(venue.price_level) : 0);
    } else {
      pricelevel = total + (venue?.services_provider_price
        ? parseFloat(venue.services_provider_price
        ) : 0);

    }


    return pricelevel;
  }, 0);

  const handleInputChange = (venue, value) => {
    setInputs(prevInputs =>
      prevInputs.map(input =>
        input.id === venue.place_id ? { ...input, price: value } : input
      )
    );
  };
  useEffect(() => {
    if (item?.package) {
      setInputs(
        item.package.map(venue => ({
          id: venue.place_id,
          price: venue.services_provider_price || venue.price_level || ""
        }))
      );
    }
  }, [item]);
  const handlePriceChange = (venue) => {
    const updatedInput = inputs?.find(input => input.id === venue.place_id);
    if (!updatedInput) return;
    const { price } = updatedInput;
    const updatedTotalPriceLevel = item?.package?.reduce((total, currentVenue) => {
      const venuePrice =
        currentVenue.place_id === venue.place_id
          ? parseFloat(price || 0)  // Use updated price for the current venue
          : currentVenue.price_level
            ? parseFloat(currentVenue.price_level)
            : parseFloat(currentVenue.services_provider_price || 0);

      return total + (venuePrice || 0); // Add the calculated price for the venue to the total
    }, 0);


    setLoading(true);

    const main = new Listing();
    main.BookingPriceUpdate({
      _id: Id,
      place_id: venue.place_id,
      price: price * currencyprice,
      totalPrice: updatedTotalPriceLevel * item?.attendees * currencyprice,
      currency: currency
    })
      .then((res) => {
        if (res && res?.data?.status) {
          fetchData(res?.data?.data?._id);
          toast.success(res.data.message);

          // Update inputs with the response price if needed
          setInputs(prevInputs =>
            prevInputs.map(input =>
              input.id === venue.place_id ? { ...input, price: res.data.price } : input
            )
          );
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
  console.log("currencyprice", currencyprice)
  const fectcurrency = async () => {
    try {
      const main = new Listing();
      const response = await main.CurrencyChange(currency); // API call with selected currency
      console.log("response", response);
      setCurrencyPrice(response?.data?.data); // Update state with the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currency) {
      fectcurrency(); // Trigger API call when currency changes
    }
  }, [currency]); //


  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full max-w-[100%]">
          <Header title={"Booking View"} />
          <div className="w-full  bg-[#1B1B1B] p-[10px] md:p-[25px] rounded-[10px] md:rounded-[20px] mt-[15px]">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-[20px]">
                <h3 className="text-[30px] font-semibold text-white mb-[5px]">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="ml-4 mr-4 mt-5 mb-5 bg-[#EB3465] hover:bg-[#fb3a6e] font-manrope font-[700] text-[14px] px-[20px] py-[10px] text-white rounded-[5px] text-center  cursor-pointer"
                  >
                    <IoIosArrowBack size={24} />
                  </button>
                  Booking View
                </h3>
                <button
                  className={`min-w-[110px] capitalize border font-[manrope] font-[600] text-[16px] text-center px-[15px] py-[6px] rounded-[60px] ${item?.status === "pending"
                    ? "border-[#B8A955] bg-[#B8A9551A] text-[#B8A955]"
                    : item?.status === "approved"
                      ? "border-[#4CAF50] bg-[#4CAF501A] text-[#4CAF50]"
                      : item?.status === "rejected"
                        ? "border-[#EB3465] bg-[#EB34651A] text-[#EB3465]"
                        : ""
                    }`}
                >
                  {item?.status}
                </button>
              </div>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="mb-4 w-full">
                  <div className="flex flex-wrap lg-flex-nowrap gap-[20px]">
                    <div className="w-[100%] md:w-[40%] lg:w-[40%]">
                      <div>
                        <img
                          className="w-full object-cover max-h-[400px] rounded-[10px]"
                          src={ViewImage}
                          alt="Sunset in the mountains"
                        />
                      </div>
                    </div>

                    <div className="w-[100%] md:w-[55%] lg:w-[55%] pl-[0px] md:pl-[10px] lg:pl-[80px] xl:pl-[100px]">
                      <div className="w-full mb-[20px] inline-flex flex-wrap justify-start gap-[10px]">
                        <span className="min-w-[110px] inline-flex  capitalize border font-[manrope] text-white font-[600] text-[16px] flex items-center px-[15px] py-[6px] rounded-[60px]">
                          Package Name : {item.package_name}
                        </span>
                        <button
                          className={`min-w-[110px] capitalize border font-[manrope] font-[600] text-[16px] text-center px-[15px] py-[6px] rounded-[60px] ${item?.status === "pending"
                            ? "border-[#B8A955] bg-[#B8A9551A] text-[#B8A955]"
                            : item?.status === "approved"
                              ? "border-[#4CAF50] bg-[#4CAF501A] text-[#4CAF50]"
                              : item?.status === "rejected"
                                ? "border-[#EB3465] bg-[#EB34651A] text-[#EB3465]"
                                : ""
                            }`}
                        >
                          {item?.status}
                        </button>
                      </div>
                      <div className="w-full mb-[10px] text-white font-semibold">
                        Date :{" "}
                        <span className=" text-[17px] ">
                          {item?.bookingDate}
                          {/* {moment(item?.bookingDate).format("MMMM Do, YYYY")} */}
                        </span>
                      </div>
                      <div className="w-full mb-[10px] text-white font-semibold">
                        Location :{" "}
                        <span className="text-white text-[17px]  ">
                          {item?.location}
                        </span>
                      </div>
                      <div className="w-full mb-2.5 text-white font-semibold">
                        <span className="text-red-500 text-lg">
                          Please review the price and currency before confirming the booking. You can make changes if necessary.
                        </span>
                      </div>
                      <div className="w-full mb-[10px] text-white font-semibold">
                        Price :{" "}
                        <span className="text-white text-[17px]  ">
                          {currencySymbol[currency]} {pricelevel * currencyprice}

                        </span>
                      </div>
                      <div className="w-full mb-[10px] text-white font-semibold">
                        Total Price (totalPrice* Number of Attendees):{" "}
                        <span className="text-white text-[17px] flex mt-3  ">
                          {currencySymbol[currency]} {item?.totalPrice * currencyprice}

                        </span>
                      </div>

                      {item?.status === "approved" ? (
                        <div className="w-full mb-[10px] text-white font-semibold">
                          Number of attendees:{" "}
                          <span className="text-white text-[17px]  ">
                            {item?.attendees}
                          </span>
                        </div>
                      ) : (
                        <div className=" inline-flex items-center capitalize border font-manrope text-white font-[600]  px-[15px] py-[5px] rounded-[60px]"> <span className="flex items-center gap-1">
                          <span className="text-[16px]">Number of attendees:</span>
                        </span>
                          <input type="number" value={attend} onChange={(e) => (setAttend(e.target.value))} className="cursor-pointer text-white ml-2 bg-transparent outline-none  font-semibold text-left" />
                        </div>
                      )}

                      {item?.status === "approved" ? (
                        <div className="w-full mb-[10px] text-white font-semibold">
                          Select Currency :{" "}
                          <span className="text-white text-[17px]  ">
                            {item?.currency}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className=" inline-flex items-center  mt-3  mb-3 capitalize  font-manrope text-white font-[600]  px-[15px] py-[5px] rounded-[60px]">
                            <span className="text-[16px]">Select Currency :</span>
                          </div>
                          <select
                            value={currency}
                            className="px-3 py-2 rounded bg-gray-700 border border-white text-white "
                            onChange={(e) => (setCurrency(e.target.value))}
                          >
                            {currencies.map((currency, idx) => (
                              <option key={idx} value={currency}>
                                {currency}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                      {item?.status === "approved" ? (
                        <></>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
                          {item?.package?.map((venue, index) => (<div key={index}
                            className="flex flex-wrap gap-4 mb-3 p-2">
                            <label className="text-white">
                              <span className="text-green-500 capitalize">{venue.services_provider_name || venue?.name}  </span>
                              Manage Price (Per Person)</label>
                            <p className="text-white text-[15px]">
                              Convert Currency Price:-
                              <span className="flex mt-1"> 
                              {currencySymbol[currency]}  {venue?.services_provider_price? venue?.services_provider_price*currencyprice :venue?.price_level*currencyprice }
                              </span>
                              </p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <p className="text-white">  {currencySymbol[item?.CurrencyCode]}</p>
                                <input
                                  type="number"
                                  className="px-3 py-2 rounded bg-gray-700 border border-white text-white w-full"
                                  placeholder="Enter Price"
                                  value={inputs?.find(input => input.id === venue.place_id)?.price || ""}
                                  onChange={(e) => handleInputChange(venue, e.target.value)}
                                />
                                <button onClick={() => handlePriceChange(venue)} className={`text-white bg-gray-800 rounded-full p-2 ${loading ? "opacity-50 pointer-events-none" : ""}`} disabled={loading} >
                                  <FaEdit size={16} /> </button>
                              </div>
                            </div>
                          </div>
                          ))} </div>
                      )}
                      <div>
                        <p className="w-full mb-[10px] text-white text-[17px] font-bold">
                          User Detail :{" "}
                        </p>
                        <div className="w-full mb-[10px] text-white font-semibold">
                          Name   :{" "}
                          <span className="text-white capitalize text-[17px]  ">
                            {item?.userId?.username}
                          </span>
                        </div>

                        <div className="w-full mb-[10px] text-white font-semibold">
                          Email   :{" "}
                          <span className="text-white text-[17px]  ">
                            {item?.userId?.email}
                          </span>
                        </div>

                        <div className="w-full mb-[10px] text-white font-semibold">
                          Phone Number   :{" "}
                          <span className="text-white text-[17px]  gap-2">
                            {item?.userId?.phone_code}
                            {item?.userId?.phone_number}
                          </span>
                        </div>

                      </div>
                    </div>


                  </div>

                  <h3 className="text-[20px] md:text-[25px] lg:text-[30px] font-semibold text-white mb-3 mt-[20px] lg:mt-[40px]">
                    Services Provider Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                    {item?.package?.map((venue, index) => (
                      <div
                        className="bg-[#1B1B1B] shadow-lg rounded-lg overflow-hidden flex flex-col  border border-[#9999]"
                        key={index}
                      >
                        <VenuePhotos venue={venue} />
                        <div className=" px-[10px] md:px-[10px] py-[10px]">
                          <div className="flex justify-between items-center mb-[20px]">
                            <h2 className="text-xl font-semibold capitalize text-white">
                              {venue.services_provider_name || venue?.name}
                            </h2>
                            {venue.services_provider_phone && (<Link to={`tel:${venue.services_provider_phone}`} className="flex items-center gap-2 h-9 text-white bg-[#000] rounded-full px-4 py-1 text-xs" > <FaPhoneAlt size={12} className="inline" /> {venue.services_provider_phone} </Link>)}
                          </div>

                          <div className="flex flex-wrap items-center justify-start md:justify-between mb-[15px]">
                            {venue.services_provider_email && (<Link to={`mailto:${venue.services_provider_email}`} className="flex items-center gap-2 w-[100%] md:w-[40%] text-white text-sm" > <FaEnvelope size={14} className="inline" /> {venue.services_provider_email} </Link>)}
                            {venue.services_provider_categries && (
                              <p className="flex items-center gap-2 md:mt-0 mt-3 h-9 text-white bg-[#000] rounded-full px-4 py-1 text-xs break-words whitespace-normal text-white text-[13px] capitalize">
                                {venue.services_provider_categries}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between"> {venue.placeDetails?.international_phone_number && (<div className="flex items-center gap-2 text-white text-[15px] mb-[15px]"> <p className="font-bold"> <FaPhoneAlt size={12} /> </p> <a href={`tel:${venue.placeDetails.international_phone_number}`} className="text-[#0fc036] text-[13px] font-[700] flex items-center gap-[10px]" > {venue.placeDetails.international_phone_number} </a> </div>)} {venue.placeDetails?.formatted_phone_number && (<div className="flex items-center gap-2 text-white text-[15px] mb-[15px]"> <p className="font-bold"> <BsFillTelephoneForwardFill size={12} /> </p> <a href={`tel:${venue.placeDetails.formatted_phone_number}`} className="text-[#0fc036] text-[13px] font-[700] flex items-center gap-[10px]" > {venue.placeDetails.formatted_phone_number} </a> </div>)} </div>
                          <div className="flex flex-wrap items-center justify-between gap-[10px] mb-[15px]">
                            {venue?.price_level && (

                              <p className="text-white text-[15px]">
                                <span> Price Level: </span>
                                {currencySymbol[item?.CurrencyCode]}
                                {venue?.price_level
                                  ? venue?.price_level
                                  : "N/A"}
                              </p>
                            )}


                            {venue?.services_provider_price && (
                              <p className="text-white text-[15px]">
                                {currencySymbol[item?.CurrencyCode]}
                                {venue?.services_provider_price &&
                                  `${venue.services_provider_price}/person`}
                              </p>
                            )}


                            <div className="flex items-center gap-2 h-9 text-white bg-[#000] rounded-full px-4 py-1 text-xs">
                              <IoStar size={11} className="text-[#ffff00]" />
                              {venue.services_provider_rating || venue?.rating}
                            </div>
                          </div>

                          <p className="text-[#fff] text-[16px] mt-2 whitespace-normal overflow-hidden">
                            {venue.package_categories?.map(
                              (category, index) => (
                                <span
                                  key={index}
                                  className="bg-black capitalize text-white px-4 py-1 rounded-full mr-2 mb-2 inline-block"
                                >
                                  {category}
                                </span>
                              )
                            )}
                          </p>

                          {venue?.types && (
                            <p className="text-[#fff] text-[16px] mt-2 whitespace-normal overflow-hidden">
                              {venue?.types
                                ?.filter((category) => category !== "point_of_interest") // Exclude point_of_interest
                                .map((category, index) => (
                                  <span
                                    key={index}
                                    className="bg-black capitalize text-white px-4 py-1 rounded-full mr-2 mb-2 inline-block"
                                  >
                                    {category}
                                  </span>
                                ))}
                            </p>
                          )}


                          <p className="text-[#fff] text-[16px] mt-2 whitespace-normal overflow-hidden mb-5 flex gap-2 hover:text-[#4CAF50]">  <FaMapMarkerAlt size={24} />  {" "} {venue.package_address ? venue.package_address : venue?.vicinity} </p>
                          <p className="text-[#fff] text-[16px] mt-2 whitespace-normal overflow-hidden">
                            {venue?.package_descrption}{" "}
                          </p>
                        </div>


                      </div>
                    ))}
                  </div>

                  {item?.status === "pending" && (
                    <div className="w-full mb-[10px] mt-[30px]">
                      <div className="flex flex-wrap  flex-row items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleActiveStatues(item?._id, "approved")}
                            className="min-w-[110px] border-[#4CAF50] bg-[#4CAF501A] text-[#4CAF50] capitalize border font-[manrope] font-[600] text-[16px] text-center px-[15px] py-[6px] rounded-[60px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleActiveStatues(item?._id, "rejected")}
                            className="min-w-[110px] border-[#EB3465] bg-[#EB34651A] text-[#EB3465] capitalize border font-[manrope] font-[600] text-[16px] text-center px-[15px] py-[6px] rounded-[60px]"
                          >
                            Reject
                          </button>
                        </div>

                      </div>

                    </div>
                  )}


                  <div className="w-full ">
                    <div className="flex flex-wrap items-center justify-start py-4 gap-[5px] md:gap-[10px]">
                      {/* Right Section: Payment Generator Button */}
                      <div>
                        {payment?.payment_status !== "success" ? (
                          item?.status === "approved" &&
                          item?.totalPrice !== 0 && (
                            <button
                              onClick={() => handlepayment(item?._id)}
                              className="bg-[#ff0062] hover:bg-[#4400c3] text-white font-bold text-[12px] md:text-[14px] py-[13px] px-[10px] md:px-[10px] rounded"
                            >
                              Payment Generator
                            </button>
                          )
                        ) : (
                          <button
                            className={`min-w-[110px] capitalize border font-[manrope] font-[600] text-[16px] text-center px-[15px] py-[6px] rounded-[60px] border-[#4CAF50] bg-[#4CAF501A] text-[#4CAF50]`}
                          >
                            Payment successfully done.
                          </button>

                        )}

                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}