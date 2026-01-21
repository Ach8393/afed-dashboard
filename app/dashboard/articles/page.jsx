'use client';

import { useEffect, useState } from 'react';
import API from '../../../lib/api';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  // Form states
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [date, setDate] = useState('');
  const [responsibilities, setResponsibilities] = useState('');

  // File states (AVOID controlled/uncontrolled errors)
  const [imgFile, setImgFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // Edit mode
  const [editId, setEditId] = useState(null);

  // You MUST set this depending on your auth system
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch articles
  const fetchArticles = async () => {
    try {
      const res = await API.get('/articles');
      setArticles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ADD article
  const handleAddArticle = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("review", review);
      formData.append("date", date);
      formData.append("responsibilities", responsibilities);

      if (imgFile) formData.append("imgPath", imgFile);
      if (logoFile) formData.append("logoPath", logoFile);

      await API.post("/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      resetForm();
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT article
  const handleEditSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("review", review);
      formData.append("date", date);
      formData.append("responsibilities", responsibilities);

      // Optional files on edit
      if (imgFile) formData.append("imgPath", imgFile);
      if (logoFile) formData.append("logoPath", logoFile);

      await API.put(`/articles/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      });

      resetForm();
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE article
  const handleDelete = async (id) => {
    try {
      await API.delete(`/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setReview('');
    setDate('');
    setResponsibilities('');
    setImgFile(null);
    setLogoFile(null);
    setEditId(null);
  };

  const handleEditClick = (article) => {
    setEditId(article._id);
    setTitle(article.title);
    setReview(article.review);
    setDate(article.date);
    setResponsibilities(article.responsibilities?.join('\n') || '');
    setImgFile(null);
    setLogoFile(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Expérience professionnelle Management</h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={editId ? () => handleEditSave(editId) : handleAddArticle}
        className="mb-6 space-y-2 p-4 border rounded bg-gray-50"
      >
        <input
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Review"
          className="w-full p-2 border rounded"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <input type="date" className="p-2 border rounded" value={date} onChange={(e) => setDate(e.target.value)} />

        <textarea
          placeholder="Responsibilities (one per line)"
          className="w-full p-2 border rounded"
          value={responsibilities}
          onChange={(e) => setResponsibilities(e.target.value)}
        />

        <p>Baniere:</p>
        <input className="w-full p-2 border rounded" type="file" onChange={(e) => setImgFile(e.target.files[0])} />
        <p>Logo:</p>
        <input className="w-full p-2 border rounded" type="file" onChange={(e) => setLogoFile(e.target.files[0])} />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {editId ? 'Save Changes' : 'Add Article'}
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
      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((a) => (
          <div key={a._id} className="border p-4 rounded bg-white shadow">
            <h2 className="font-semibold text-lg">{a.title}</h2>
            <p className="text-gray-600">{a.review}</p>
            <p className="text-sm text-gray-500">{a.date}</p>

            {a.imgPath && (
              <img src={a.imgPath} alt="" className="w-32 mt-2 rounded" />
            )}
            {a.logoPath && (
              <img src={a.logoPath} alt="" className="w-20 mt-2 rounded" />
            )}

            <div className="flex space-x-2 mt-3">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => handleEditClick(a)}
              >
                Edit
              </button>

              <button
                className="bg-red-600 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(a._id)}
              >
                Delete
              </button>
            </div>

            {a.responsibilities?.length > 0 && (
              <ul className="mt-3 list-disc list-inside">
                {a.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
