import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { fetchData } from "../api/axiosService";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UploadImg = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const getPreSigned = async (file) => {
    // Request a presigned URL from the backend
    const response = await fetchData(
      "GET",
      `/api/files/presigned-upload/${file.name}`
    );
    if (response.status != 200) {
      console.error("Failed to fetch presigned URL");
      return;
    }
    const presignedUrl = await response.data;

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
      return;
    }

    // Get the S3 URL for the uploaded image
    const fileUrl = presignedUrl.split("?")[0]; // Strip query params to get final S3 URL
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        fontSize: "18px", // Bigger font
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      type="button"
    >
      <PlusOutlined style={{ fontSize: "32px" }} /> {/* Bigger icon */}
      <div style={{ marginTop: 12 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Upload
        action={getPreSigned}
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        style={{ width: "150px", height: "150px" }} // Increased size
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
          width={500} // Bigger preview
        />
      )}
    </>
  );
};

export default UploadImg;
