import React from "react";
import styles from "./CategoryGrid.module.css";

const womensWearItems = [
  {
    name: "Shorts",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Trendy and comfortable shorts for summer days."
  },
  {
    name: "Tops",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Stylish tops for every occasion."
  },
  {
    name: "Tank Tops",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Cool and comfy tank tops for layering or solo wear."
  },
  {
    name: "Dresses",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Elegant dresses for parties and casual outings."
  },
  {
    name: "Skirts",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Flowy skirts in various lengths and styles."
  },
  {
    name: "Blouses",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Chic blouses for work and play."
  },
  {
    name: "Jeans",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Classic jeans in all fits and washes."
  },
  {
    name: "Leggings",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Stretchy leggings for comfort and style."
  }
];

export default function WomensWear() {
  return (
    <div className={styles.categoryPage}>
      <h2 className={styles.categoryTitle}>Women's Wear</h2>
      <div className={styles.grid}>
        {womensWearItems.map((item) => (
          <div className={styles.card} key={item.name}>
            <img src={item.img} alt={item.name} className={styles.image} />
            <div className={styles.cardContent}>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p className={styles.itemDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 