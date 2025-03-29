import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import GoogleMapPin from "../Sections/GoogleMapPin";
import NavBar from "../../components/NavBar";
import { AuthContext } from "../../context/AuthContext";
import { Avatar, message } from "antd";
import Loading from "../../components/Loading";
import { Image } from "antd";
import {
  PhoneFilled,
  MailFilled,
  GlobalOutlined,
  FacebookFilled,
  InstagramOutlined,
  YoutubeFilled,
  TikTokOutlined,
  MessageFilled,
  EnvironmentFilled,
} from "@ant-design/icons";
import {
  getPlaceDetail,
  getPlacePhoto,
  reviewPlace,
  checkIfFavorited,
  toggleFavorite,
} from "../../api/placeApi";

function PlaceDetail() {
  const { placeId } = useParams();
  const [placeDetails, setPlaceDetails] = useState(null);
  const [placeImage, setPlaceImage] = useState(null);
  const [photos, setPhotos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const { isAuth, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placesData = await getPlaceDetail(placeId);
        setPlaceDetails(placesData.data.place);
        setPlaceImage(placesData.data.image);

        const photosdata = await getPlacePhoto(placeId);
        setPhotos(photosdata.data);

        if (isAuth) {
          const likedData = await checkIfFavorited(placeId);
          setIsFavorited(likedData.data);
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [placeId, isAuth]);

  const onPostReview = async () => {
    if (rating === 0) {
      message.error("Please provide a rating score.");
      return;
    }
    try {
      const response = await reviewPlace(placeId, rating, reviewText);

      if (response.status === 200 || response.status === 201) {
        setReviewText("");
        setRating(0);
        setError(null);

        const updatedPlaceDetail = await getPlaceDetail(placeId);
        const updatedPlaceDetailScore = updatedPlaceDetail.data.score;

        setPlaceDetails((prev) => ({
          ...prev,
          placeReviews: [...prev.placeReviews, response.data],
          score: updatedPlaceDetailScore,
        }));
      }
    } catch (error) {
      setError("Failed to submit review. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async () => {
    try {
      const response = await toggleFavorite(placeId);
      if (response.status === 200 || response.status === 201) {
        setIsFavorited(response.data);
      }
    } catch (error) {
      setError("Failed to like/unlike place. Please try again later.");
    }
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      {loading && <Loading loading={loading}></Loading>}

      <NavBar variant="black" />
      <div className=" w-full mx-auto py-10 px-[120px]">
        {placeDetails && (
          <div className="bg-white p-6 pt-[50px]">
            {/* Info */}
            <div className="flex items-end mb-3">
              <div>
                <p className=" font-medium text-purple-400">
                  {placeDetails.province}
                </p>
                <h2 className="text-xl font-semibold text-gray-800">
                  {placeDetails.nameTh}{" "}
                  {placeDetails.nameEn && `(${placeDetails.nameEn})`}
                </h2>
                <p className=" text-gray-600">{placeDetails.category.name}</p>
              </div>
              <div className="flex ms-auto">
                <div className="mt-1 me-5">
                  <div className="flex">
                    {/* Render 5 stars*/}
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill={
                          index < Math.floor(placeDetails.score)
                            ? "currentColor"
                            : "none"
                        }
                        stroke={
                          index < Math.floor(placeDetails.score)
                            ? "none"
                            : "lightgray"
                        }
                        strokeWidth="1"
                        className={`w-5 h-5 ${
                          index < Math.floor(placeDetails.score)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.27l4.15 2.18-1.08-4.73L18 7.24l-4.91-.42L10 2.5 7.91 6.82 3 7.24l3.93 5.48-1.08 4.73L10 15.27z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-400 text-end">
                    {placeDetails.score ? placeDetails.score : 0} / 5
                  </p>
                </div>
                {isAuth && (
                  <div>
                    {/* Heart icon */}
                    <svg
                      onClick={addFavorite}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isFavorited ? "red" : "none"}
                      stroke={isFavorited ? "red" : "gray"}
                      className="w-7 h-7 cursor-pointer"
                    >
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <Image
                src={placeImage}
                fallback="/default-mockup-place.jpg"
                width={"100%"}
                height={"500px"}
                className="object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Detail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-9">
              <div className="custom-card bg-violet-700 text-white">
                <p className="font-semibold text-2xl mb-1">Operating Hours</p>
                <p>{placeDetails.startEnd}</p>
              </div>

              <div className="custom-card bg-purple-700 text-white">
                <p className="font-semibold text-2xl mb-1">Fee</p>
                <p className=" flex">
                  Thai Adults
                  <div class="ms-auto">
                    <span className="mx-2">
                      {placeDetails.feeTh ? placeDetails.feeTh : "-"}
                    </span>
                    THB
                  </div>
                </p>
                <p className=" flex">
                  Thai Kids
                  <div class="ms-auto">
                    <span className="mx-2">
                      {placeDetails.feeThKid ? placeDetails.feeThKid : "-"}
                    </span>
                    THB
                  </div>
                </p>
                <p className=" flex">
                  Foreigner Adults
                  <div class="ms-auto">
                    <span className="mx-2">
                      {placeDetails.feeEn ? placeDetails.feeEn : "-"}
                    </span>
                    THB
                  </div>
                </p>
                <p className=" flex">
                  Foreigner Kids
                  <div class="ms-auto">
                    <span className="mx-2">
                      {placeDetails.feeEnKid ? placeDetails.feeEnKid : "-"}
                    </span>
                    THB
                  </div>
                </p>
              </div>

              <div className="custom-card bg-blue-950 text-white">
                <p className="font-semibold text-2xl mb-1">Contact</p>
                {placeDetails.tel && (
                  <p className="">
                    <PhoneFilled className="me-2" />
                    {placeDetails.tel}
                  </p>
                )}
                {placeDetails.email && (
                  <p className="">
                    <a href={`mailto:${placeDetails.email}`}>
                      <MailFilled className="me-2" />
                      {placeDetails.email}
                    </a>
                  </p>
                )}
                {placeDetails.website && (
                  <p className="">
                    <GlobalOutlined className="me-2" />
                    {placeDetails.website}
                  </p>
                )}
                {placeDetails.facebook && (
                  <p className="">
                    <FacebookFilled className="me-2" />
                    {placeDetails.facebook}
                  </p>
                )}
                {placeDetails.instagram && (
                  <p className="">
                    <InstagramOutlined className="me-2" />
                    {placeDetails.instagram}
                  </p>
                )}
                {placeDetails.tiktok && (
                  <p className="">
                    <TikTokOutlined className="me-2" />
                    {placeDetails.tiktok}
                  </p>
                )}
                {placeDetails.youtube && (
                  <p className="">
                    <YoutubeFilled className="me-2" />
                    {placeDetails.youtube}
                  </p>
                )}
                {placeDetails.line && (
                  <p className="">
                    <MessageFilled className="me-2" />
                    {placeDetails.line}
                  </p>
                )}
              </div>
            </div>

            {/* Gallery */}
            {photos && photos.length > 1 && (
              <div className="mb-9">
                <p className="text-xl font-semibold mb-1">Gallery</p>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      style={{
                        flex: "0 0 auto",
                        width: "500px",
                        height: "300px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        scrollSnapAlign: "start",
                      }}
                    >
                      <Image
                        src={photo}
                        fallback="/default-mockup-place.jpg"
                        width={"100%"}
                        height={"100%"}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address */}
            <div className="mb-9">
              <p className="text-xl font-semibold mb-1">Address</p>
              <div className="flex gap-3">
                <div className="w-[25%]">
                  <div className="custom-card bg-blue-950 text-white h-[100%] flex flex-col items-center justify-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg text-4xl mb-6">
                      <EnvironmentFilled />
                    </div>
                    {placeDetails.province && (
                      <div className="flex text-4xl font-semibold mb-6 break-words">
                        {placeDetails.province}
                      </div>
                    )}
                    <div className="d-flex flex-col justify-center">
                      {placeDetails.address && (
                        <div className="flex">
                          <span className="font-semibold me-1">ที่อยู่</span>
                          <p>{placeDetails.address}</p>
                        </div>
                      )}
                      {placeDetails.district && (
                        <div className="flex">
                          <span className="font-semibold me-1">เขต</span>
                          <p>{placeDetails.district}</p>
                        </div>
                      )}
                      {placeDetails.subdistrict && (
                        <div className="flex">
                          <span className="font-semibold me-1">แขวง</span>
                          <p>{placeDetails.subdistrict}</p>
                        </div>
                      )}
                      {placeDetails.road && (
                        <div className="flex">
                          <span className="font-semibold me-1">ถนน</span>
                          <p>{placeDetails.road}</p>
                        </div>
                      )}
                      {placeDetails.alley && (
                        <div className="flex">
                          <span className="font-semibold me-1">ซอย</span>
                          <p>{placeDetails.alley}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-[75%]">
                  <GoogleMapPin
                    location={{
                      lat: Number(placeDetails.location.split(",")[0].trim()),
                      lng: Number(placeDetails.location.split(",")[1].trim()),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Review */}
            <div className="mb-3">
              <p className="text-xl font-semibold">Reviews</p>
              {placeDetails.placeReviews &&
                placeDetails.placeReviews.length > 0 && (
                  <div className="">
                    {placeDetails.placeReviews.map((review) => (
                      <div
                        key={review.id}
                        className="mt-2 p-4 border-t border-gray-300"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex">
                            <Avatar
                              size="large"
                              src={
                                JSON.parse(localStorage.getItem("user"))
                                  ?.imageUrl
                              }
                            />
                            <p className="font-semibold ml-3">
                              {review.user.displayName}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {/* Render 5 stars*/}
                            {[...Array(5)].map((_, index) => (
                              <svg
                                key={index}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill={
                                  index < review.score ? "currentColor" : "none"
                                }
                                stroke={
                                  index < review.score ? "none" : "lightgray"
                                }
                                strokeWidth="1"
                                className={`w-5 h-5 ${
                                  index < review.score
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 15.27l4.15 2.18-1.08-4.73L18 7.24l-4.91-.42L10 2.5 7.91 6.82 3 7.24l3.93 5.48-1.08 4.73L10 15.27z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{review.content}</p>
                        <p className="mt-2 text-gray-500 text-sm">
                          Reviewed on{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              {isAuth && (
                <div className="mt-2 border border-gray-200 rounded-lg bg-gray-100 px-7 py-5 shadow-md">
                  {/* User Name */}
                  <p className="font-semibold">
                    {JSON.parse(JSON.stringify(user)).username}
                  </p>

                  {/* Review Input */}
                  <textarea
                    className="w-full mt-3 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    rows="3"
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>

                  {/* Rating and Button Container */}
                  <div className="mt-2 flex items-center justify-between">
                    {/* Star Rating */}
                    <div className="flex items-center">
                      <span className="text-gray-700 me-2">Your Rating:</span>
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          onClick={() => setRating(index + 1)}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill={index < rating ? "currentColor" : "none"}
                          stroke="gray"
                          strokeWidth="1"
                          className={`w-6 h-6 cursor-pointer transition-all duration-200 ${
                            index < rating ? "text-yellow-500" : "text-gray-400"
                          }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.27l4.15 2.18-1.08-4.73L18 7.24l-4.91-.42L10 2.5 7.91 6.82 3 7.24l3.93 5.48-1.08 4.73L10 15.27z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>

                    {/* Post Review Button */}
                    <button
                      className="px-5 py-2 bg-black text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-purple-400"
                      onClick={onPostReview}
                    >
                      Post Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaceDetail;
