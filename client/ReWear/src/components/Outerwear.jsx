import React from "react";
import styles from "./CategoryGrid.module.css";

const outerwearItems = [
  {
    name: "Jackets",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Versatile jackets for all seasons."
  },
  {
    name: "Coats",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Warm coats for winter chills."
  },
  {
    name: "Blazers",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Smart blazers for formal and casual looks."
  },
  {
    name: "Sweatshirts",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Cozy sweatshirts for relaxed days."
  },
  {
    name: "Windcheaters",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Lightweight windcheaters for breezy weather."
  },
  {
    name: "Raincoats",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Stay dry with stylish raincoats."
  },
  {
    name: "Ponchos",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Trendy ponchos for a unique look."
  },
  {
    name: "Capes",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Elegant capes for layering."
  },
  {
    name: "Vests",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Versatile vests for extra warmth."
  },
  {
    name: "Parkas",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Heavy-duty parkas for extreme cold."
  }
];

export default function Outerwear() {
  return (
    <div className={styles.categoryPage}>
      <h2 className={styles.categoryTitle}>Outerwear</h2>
      <div className={styles.grid}>
        {outerwearItems.map((item) => (
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