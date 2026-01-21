'use client';

import { useEffect, useState } from 'react';
import API from '../../../lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [technologies, setTechnologies] = useState('');

  // File state
  const [imageFile, setImageFile] = useState(null);

  // Edit mode
  const [editId, setEditId] = useState(null);

  // Token
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ADD project
  const handleAddProject = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);
      formData.append(
        'technologies',
        JSON.stringify(
          technologies.split('\n').map((t) => t.trim()).filter(Boolean)
        )
      );

      if (imageFile) formData.append('imgPath', imageFile);

      await API.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      resetForm();
      fetchProjects();
    } catch (err) {
      console.error('Failed to add project:', err);
    }
  };

  // SAVE edits
  const handleEditSave = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);
      formData.append(
        'technologies',
        JSON.stringify(
          technologies.split('\n').map((t) => t.trim()).filter(Boolean)
        )
      );

      if (imageFile) formData.append('imgPath', imageFile);

      await API.put(`/projects/${editId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      resetForm();
      fetchProjects();
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  // Reset
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTechnologies('');
    setImageFile(null);
    setEditId(null);
  };

  // Fill for editing
  const handleEditClick = (p) => {
    setEditId(p._id);
    setTitle(p.title);
    setDescription(p.description);
    setDate(p.date ? p.date.substring(0, 10) : '');
    setTechnologies(p.technologies?.join('\n') || '');
    setImageFile(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Projects Management</h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={editId ? handleEditSave : handleAddProject}
        className="mb-6 space-y-2 p-4 border rounded bg-gray-50"
      >
        <input
          placeholder="Project Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <textarea
          placeholder="Technologies (one per line)"
          className="w-full p-2 border rounded"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
        />

        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {editId ? 'Save Changes' : 'Add Project'}
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

      {/* Projects list */}
      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p._id} className="border p-4 rounded bg-white shadow">
            <h2 className="font-semibold text-lg">{p.title}</h2>
            <p className="text-gray-600">{p.description}</p>
            <p className="text-sm text-gray-500">{p.date}</p>

            {p.imgPath && (
              <img
                src={p.imgPath}
                alt="project"
                className="w-32 mt-2 rounded"
              />
            )}

            <div className="flex space-x-2 mt-3">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => handleEditClick(p)}
              >
                Edit
              </button>

              <button
                className="bg-red-600 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </div>

            {p.technologies?.length > 0 && (
              <ul className="mt-3 list-disc list-inside">
                {p.technologies.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
