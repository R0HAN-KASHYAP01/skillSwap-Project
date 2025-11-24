"use client";

import { useState } from "react";
import "./styles.css";

export default function PostGrid() {
  const [images, setImages] = useState([]);

  function handleAddImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImages(prev => [...prev, url]);
  }

  return (
    <div className="post-grid">
      {/* Add Post Button (Always First) */}
      <label className="add-box">
        <span className="plus">+</span>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleAddImage}
          style={{ display: "none" }}
        />
      </label>

      {/* Display User Images */}
      {images.map((img, index) => (
        <div key={index} className="photo-box">
          <img src={img} alt="post" />
        </div>
      ))}
    </div>
  );
}
