'use client';

import { useEffect, useState } from 'react';
import API from '../../../lib/api';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchGallery = async () => {
    try {
      const res = await API.get('/gallery');
      setImages(res.data.data);
    } catch (err) {
      console.error("Erreur chargement galerie", err);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imgFile) return alert("Sélectionnez une image");
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("imgPath", imgFile);

      await API.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle('');
      setImgFile(null);
      fetchGallery();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await API.delete(`/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion de la Galerie</h1>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleUpload} className="mb-8 p-4 border rounded bg-gray-50 flex flex-col gap-3">
        <input 
          placeholder="Titre de la photo (optionnel)" 
          className="p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input 
          type="file" 
          accept="image/*"
          className="p-2"
          onChange={(e) => setImgFile(e.target.files[0])} 
        />
        <button 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Envoi en cours...' : 'Ajouter à la galerie'}
        </button>
      </form>

      {/* Grid de visualisation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="relative group border rounded overflow-hidden shadow-sm">
            <img src={img.imgPath} alt={img.title} className="w-full h-40 object-cover" />
            <div className="p-2 flex justify-between items-center bg-white">
              <span className="text-xs truncate w-24">{img.title || "Sans titre"}</span>
              <button 
                onClick={() => handleDelete(img._id)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}