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

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [userId] = useState(user?.id);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchValue, setSearchValue] = useState(SearchValue);
  const [tempDisplayName, setTempDisplayName] = useState(displayName);
  const [profileImage, setProfileImage] = useState(
    "https://randomuser.me/api/portraits/men/1.jpg"
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

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        message.error("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = (image) => {
    setPreviewImage(image);
    setPreviewOpen(true);
  };

  const handleSearch = async (newPage) => {
    if (!user?.id) return;
    let page;
    if (newPage > 1) {
      page = newPage - 1;
    }
    setLoading(true);
    try {
      // Mapping the selected options to only include values
      const formattedSearchValue = {
        ...searchValue,
        userId: user?.id,
        pageNumber: page ? page : 0,
      };

      const response = await searchPlace(formattedSearchValue);
      setPlaces(response?.data.content);
      setPage(response?.data.number);
      setTotalPage(response?.data.totalPages);
    } catch (error) {
      console.log(error);
      message.error("Load error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  }, [user]);

  return (
    <div className="w-full">
      <NavBar variant="black" />
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Info Section */}
        <div className="px-6 py-4 relative mt-40 mx-20">
          {/* Avatar with Upload */}
          <div className="absolute -top-16 left-6 border-4 border-white rounded-full group">
            <Avatar
              size={128}
              src={profileImage}
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
          <div className="mt-16 mb-4">
            <h1 className="text-2xl font-bold">{user?.displayName}</h1>

            <p className="text-gray-500">{user?.username}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Bottom Section - This is where you can add your own content */}
        <div className="p-6">
          {/* Your custom content goes here */}
          <div className="py-8 text-gray-400">
            <div className="flex flex-col justify-center items-center w-full mb-7">
              <div className="grid grid-cols-3 gap-5 mx-20  mb-5">
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
