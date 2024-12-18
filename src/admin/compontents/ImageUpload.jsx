
import React, { useState } from 'react';
import axios from 'axios';

export default function ImageUpload({ setImage, records }) {
    const imagekey = process.env.REACT_APP_IMAGE_KEY
    const [image, setLocalImage] = useState("");
    const [loading, setLoading] = useState(false);

    const uploadfile = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Access-Control-Allow-Origin": "*"
                },
                params: {
                    key: imagekey,
                    name: new Date().toISOString()
                }
            });
            setLocalImage(response.data.data.display_url);
            setImage(response.data.data.display_url);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleRemoveImage = () => {
        setLocalImage("");
        setImage("");
    }

    return (
        <div className="w-full ">
            <label htmlFor="file" className="file-upload-label">
                <div className="file-upload-design w-250">
                    <div className="flex justify-between w-full items-center" >
                        {loading ? (
                            <div className="text-center">Loading...</div>
                        ) : image ? (
                            <>
                                <img src={image} alt="Uploaded" className="max-w-full rounded-full w-10 h-12" />
                            </>
                        ) : (
                            records && (
                                <>
                                    <img src={records} alt="Uploaded" className="max-w-full rounded-full w-10 h-12" />
                                </>
                            )
                        )}
                        {/* <span className="browse-button ">Browse file</span> */}
                    </div>
                </div>
                <input id="file" type="file" onChange={uploadfile} className="bg-[#1B1B1B] border border-[#ffffff14] w-full px-[15px] py-[15px] rounded-lg text-base text-white hover:outline-none focus:outline-none" />
            </label>

        </div>
    );
}
