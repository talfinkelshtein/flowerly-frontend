import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PostService } from '../../services/PostService';
import styles from './UploadPostPage.module.css';

const exampleFlowers = ['Rose', 'Sunflower', 'Tulip', 'Daisy', 'Lavender', 'Orchid', 'Lily', 'Peony', 'Marigold', 'Jasmine'];

const UploadPostPage: React.FC = () => {
  const { userToken } = useAuth();
  const [plantType, setPlantType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!image || !plantType || !description) {
      alert('Please fill all fields before submitting.');
      return;
    }

    try {
      await PostService.uploadPost({ content: description, owner: 'CurrentUser', plantType }, image, userToken);
      navigate('/');
    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h1 className={styles.title}>Upload a New Post</h1>
      <form onSubmit={handleSubmit} className={styles.uploadForm}>
        <label className={styles.label}>Plant Type</label>
        <select value={plantType} onChange={(e) => setPlantType(e.target.value)} className={styles.input}>
          <option value="">Select a flower...</option>
          {exampleFlowers.map((flower) => (
            <option key={flower} value={flower}>
              {flower}
            </option>
          ))}
        </select>

        <label className={styles.label}>Description</label>
        <textarea placeholder="Write a caption..." value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea} />

        <label className={styles.label}>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} />
        {preview && <img src={preview} alt="Preview" className={styles.imagePreview} />}

        <button type="submit" className={styles.submitButton}>
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadPostPage;
