import React, { useState, useRef, useContext, useEffect } from "react";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Image, Input, message, Modal, Pagination } from "antd";
import NavBar from "../../components/NavBar";
import { AuthContext } from "../../context/AuthContext";
import { searchPlace } from "../../api/placeApi";
import SearchValue from "../Place/SearchValue";
import { Link } from "react-router-dom";
import { fetchData, fetchDataWithAuth } from "../../api/axiosService";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UserProfile = () => {
  const { user, isAuth } = useContext(AuthContext);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(user?.imageUrl);
  const [displayName, setDisplayName] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchValue, setSearchValue] = useState(SearchValue);
  const [tempDisplayName, setTempDisplayName] = useState(displayName);
  const [profileImage, setProfileImage] = useState(
    user?.imageUrl || "https://randomuser.me/api/portraits/men/1.jpg"
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    setTempDisplayName(displayName);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (tempDisplayName.trim() === "") {
      message.error("Display name cannot be empty");
      return;
    }
    setDisplayName(tempDisplayName);
    setIsEditing(false);
    message.success("Display name updated successfully");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const uploadProfileImage = async (file) => {
    try {
      // Request a presigned URL from the backend
      const response = await fetchData(
        "GET",
        `/api/files/presigned-upload/${file.name}`
      );

      if (response.status !== 200) {
        console.error("Failed to fetch presigned URL");
        message.error("Failed to prepare image upload");
        return;
      }

      const presignedUrl = response.data;

      // Upload the image to S3 using the presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        console.error("Failed to upload image");
        message.error("Failed to upload image");
        return;
      }

      // Get the S3 URL for the uploaded image
      const fileUrl = presignedUrl.split("?")[0];

      // Update the user's profile image in your database
      const updateResponse = await fetchDataWithAuth(
        "PUT",
        `/users/uploadImage`,
        { imgUrl: fileUrl }
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          imageUrl: fileUrl,
        })
      );

      setImg(fileUrl);

      if (updateResponse.status === 200) {
        setProfileImage(fileUrl);

        window.location.reload();
        message.success("Profile image updated successfully");
      } else {
        message.error("Failed to update profile image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Error uploading image");
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      message.error("Image must be smaller than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.match("image.*")) {
      message.error("Only image files are allowed");
      return;
    }

    try {
      // Show preview while uploading
      const preview = await getBase64(file);
      setProfileImage(preview);

      // Upload to S3
      await uploadProfileImage(file);
    } catch (error) {
      console.error("Error processing image:", error);
      message.error("Error processing image");
    }
  };

  const handlePreview = (image) => {
    setPreviewImage(image);
    setPreviewOpen(true);
  };

  const handleSearch = async (newPage) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Mapping the selected options to only include values
      const formattedSearchValue = {
        ...searchValue,
        userId: user?.id,
        pageSize: 12,
        pageNumber: newPage,
      };

      const response = await searchPlace(formattedSearchValue);
      setPlaces(response?.data.content);
      setPage(response?.data.number);
      setTotalPage(response?.data.totalElements);
    } catch (error) {
      console.log(error);
      message.error("Load error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setImg(storedUser?.imageUrl);
    const fetchData = async () => {
      setLoading(true);

      try {
        handleSearch();
      } catch (error) {
        message.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [img]);

  return (
    <div className="w-full">
      <NavBar variant="black" />
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Info Section */}
        <div className="px-6 py-4 relative mt-40 mx-20 ">
          {/* Avatar with Upload */}
          <div className=" absolute -top-16 left-6 border-4 border-white rounded-full group">
            <Avatar
              size={128}
              src={img}
              className="cursor-pointer hover:opacity-90"
              onClick={() => handlePreview(profileImage)}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="default"
                shape="circle"
                icon={<CameraOutlined />}
                onClick={() => fileInputRef.current?.click()}
                className="bg-white bg-opacity-80 hover:bg-opacity-100"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfileImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          {/* Display Name and Username */}
          <div className="ms-[20px] absolute -top-10 left-48 ">
            <h1 className="text-2xl font-bold">{user?.displayName}</h1>
            <p className="text-gray-500">{user?.username}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-40"></div>

        {/* Bottom Section */}

        <div className="p-6">
          <div className="py-8 text-gray-400">
            <div className="flex flex-col justify-center items-center w-full mb-7">
              <div>
                <p className="font-bold text-3xl text-black mb-5">
                  Favorite Places
                </p>
                <div className="grid grid-cols-3 gap-5 mb-5">
                  {places.length > 0 ? (
                    places.map((place) => (
                      <div
                        key={place.id}
                        className="w-full h-[330px] relative bg-white rounded-3xl shadow-lg aspect-square overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                      >
                        <Link to={`/places/${place.place.id}`}>
                          {/* Image Section */}
                          <div className="h-[230px] relative">
                            <Image
                              src={place.image}
                              alt={place.nameEn}
                              width={"100%"}
                              height={"100%"}
                              fallback="/default-mockup-place.jpg"
                              className="object-cover"
                              preview="false"
                            />

                            {/* Category Box (Top Right) */}
                            <div className="absolute top-3 right-3 bg-purple-400 text-white text-xs font-semibold px-4 py-1 rounded-full">
                              {place.place.category.name}
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="h-[100px] bg-white px-5 py-3">
                            <p className="text-purple-400 font-semibold text-sm mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                              {place.place.province}
                            </p>
                            <p className="text-black font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                              {place.place.nameTh}
                            </p>
                            <p className="text-black overflow-hidden text-ellipsis whitespace-nowrap">
                              {place.place.nameEn}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p>No places found.</p>
                  )}
                </div>
                <div className="">
                  <Pagination
                    align="center"
                    defaultCurrent={page}
                    total={totalPage}
                    showSizeChanger={false}
                    onChange={(newPage) => {
                      handleSearch(newPage - 1);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Preview Modal */}
        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    </div>
  );
};

export default UserProfile;
