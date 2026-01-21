'use client';

import { useEffect, useState } from 'react';
import API from '../../../lib/api';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);

  // Form states
  const [name, setName] = useState('');
  const [mentions, setMentions] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [imgFile, setImgFile] = useState(null);

  // Edit mode
  const [editId, setEditId] = useState(null);

  // Token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await API.get('/reviews');
      setReviews(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Add review
  const handleAddReview = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mentions", mentions);
      formData.append("review", reviewText);
      if (imgFile) formData.append("imgPath", imgFile);

      await API.post("/reviews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      resetForm();
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit review
  const handleEditSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mentions", mentions);
      formData.append("review", reviewText);
      if (imgFile) formData.append("imgPath", imgFile);

      await API.put(`/reviews/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      });

      resetForm();
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete review
  const handleDelete = async (id) => {
    try {
      await API.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setName('');
    setMentions('');
    setReviewText('');
    setImgFile(null);
    setEditId(null);
  };

  const handleEditClick = (review) => {
    setEditId(review._id);
    setName(review.name);
    setMentions(review.mentions);
    setReviewText(review.review);
    setImgFile(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reviews Management</h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={editId ? () => handleEditSave(editId) : handleAddReview}
        className="mb-6 space-y-2 p-4 border rounded bg-gray-50"
      >
        <input
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Mentions"
          className="w-full p-2 border rounded"
          value={mentions}
          onChange={(e) => setMentions(e.target.value)}
        />

        <textarea
          placeholder="Review"
          className="w-full p-2 border rounded"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setImgFile(e.target.files[0])}
          className="border p-2 rounded"
          placeholder="Add your image here"
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {editId ? 'Save Changes' : 'Add Review'}
        </button>

        {editId && (
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="border p-4 rounded bg-white shadow">
            <h2 className="font-semibold text-lg">{r.name}</h2>
            <p className="text-gray-600">{r.mentions}</p>
            <p className="text-gray-800 mt-1">{r.review}</p>

            {r.imgPath && (
              <img
                src={r.imgPath} // Adjust if your backend serves static files differently
                alt=""
                className="w-32 mt-2 rounded"
              />
            )}

            <div className="flex space-x-2 mt-3">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => handleEditClick(r)}
              >
                Edit
              </button>

              <button
                className="bg-red-600 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(r._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
