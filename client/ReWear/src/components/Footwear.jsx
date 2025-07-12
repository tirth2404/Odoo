import React from "react";
import styles from "./CategoryGrid.module.css";

const footwearItems = [
  {
    name: "Sneakers",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Trendy sneakers for everyday comfort."
  },
  {
    name: "Boots",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Durable boots for all terrains."
  },
  {
    name: "Sandals",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Breathable sandals for warm weather."
  },
  {
    name: "Flip Flops",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Easy-going flip flops for the beach."
  },
  {
    name: "Formal Shoes",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Elegant formal shoes for special occasions."
  },
  {
    name: "Loafers",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Classic loafers for a smart look."
  },
  {
    name: "Heels",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Stylish heels for parties and events."
  },
  {
    name: "Sports Shoes",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Performance sports shoes for active lifestyles."
  },
  {
    name: "Slippers",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Soft slippers for home comfort."
  },
  {
    name: "Ballet Flats",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Elegant ballet flats for a chic look."
  }
];

export default function Footwear() {
  return (
    <div className={styles.categoryPage}>
      <h2 className={styles.categoryTitle}>Footwear</h2>
      <div className={styles.grid}>
        {footwearItems.map((item) => (
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