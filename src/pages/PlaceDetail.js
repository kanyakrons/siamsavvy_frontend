import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import {
  getPlaceDetail,
  reviewPlace,
  checkIfFavorited,
  toggleFavorite,
} from "../api/placeApi";
import { AuthContext } from "../context/AuthContext";

function PlaceDetail() {
  const { placeId } = useParams();
  const [placeDetails, setPlaceDetails] = useState(null);
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
        setPlaceDetails(placesData.data);

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
  }, [placeId]);

  const onPostReview = async () => {
    if (rating === 0) {
      setError("Please provide a rating score.");
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="p-5 max-w-7xl mx-auto">
      {placeDetails && (
        <div className="bg-white p-6">
          <div className="my-4 flex items-end">
            <div>
              <p className="text-lg font-medium text-purple-400">
                {placeDetails.province}
              </p>
              <h2 className="text-xl font-semibold text-gray-800">
                {placeDetails.nameTh} ({placeDetails.nameEn})
              </h2>
              <p className="text-lg text-gray-600">
                {placeDetails.category.name}
              </p>
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

          <div className="my-6">
            <img
              src={placeDetails.image || "/default-mockup-place.jpg"}
              alt={placeDetails.nameEn}
              className="w-full h-80 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-lg text-gray-800">Address:</p>
              <p className="text-gray-700">
                {placeDetails.address}, {placeDetails.district},{" "}
                {placeDetails.subdistrict}, {placeDetails.province}
              </p>
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-800">Start/End:</p>
              <p className="text-gray-700">{placeDetails.startEnd}</p>
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-800">Location:</p>
              <p className="text-gray-700">{placeDetails.location}</p>
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-800">Fee:</p>
              <p className="text-gray-700">
                Adults: {placeDetails.feeTh} THB, Kids: {placeDetails.feeThKid}{" "}
                THB
              </p>
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-800">Contact:</p>
              <p className="text-gray-700">Tel: {placeDetails.tel}</p>
              <p className="text-gray-700">
                Email:{" "}
                <a
                  href={`mailto:${placeDetails.email}`}
                  className="text-blue-600"
                >
                  {placeDetails.email}
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-lg text-gray-800">
                Social Links:
              </p>
              <div className="space-x-3">
                <a
                  href={`https://${placeDetails.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Website
                </a>
                <a
                  href={`https://${placeDetails.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Facebook
                </a>
                <a
                  href={`https://${placeDetails.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Instagram
                </a>
                <a
                  href={`https://${placeDetails.line}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Line
                </a>
                <a
                  href={`https://${placeDetails.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  TikTok
                </a>
                <a
                  href={`https://${placeDetails.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  YouTube
                </a>
              </div>
            </div>

            {/* Google Map Section*/}

            {/* Review Section*/}
            <p className="text-xl font-semibold">Reviews</p>
            {placeDetails.placeReviews &&
              placeDetails.placeReviews.length > 0 && (
                <div className="mt-5 mb-5">
                  {placeDetails.placeReviews.map((review) => (
                    <div
                      key={review.id}
                      className="mt-4 p-4 border-t border-gray-300"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">
                          {review.user.displayName}
                        </p>
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
              <div className="border border-gray-200 rounded-lg bg-gray-100 px-7 py-5 shadow-md">
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
  );
}

export default PlaceDetail;
