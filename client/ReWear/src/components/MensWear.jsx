import React from "react";
import styles from "./CategoryGrid.module.css";

const mensWearItems = [
  {
    name: "Trousers",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Classic and comfortable trousers for every occasion."
  },
  {
    name: "Cargo Pants",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Functional cargo pants with plenty of pockets."
  },
  {
    name: "Shirts",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Formal and casual shirts in various styles."
  },
  {
    name: "T-Shirts",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Soft, stylish t-shirts for daily wear."
  },
  {
    name: "Jeans",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Durable jeans in all fits and washes."
  },
  {
    name: "Shorts",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Stay cool and comfortable with our shorts collection."
  },
  {
    name: "Blazers",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Sharp blazers for a polished look."
  },
  {
    name: "Suits",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Elegant suits for formal events."
  }
];

export default function MensWear() {
  return (
    <div className={styles.categoryPage}>
      <h2 className={styles.categoryTitle}>Men's Wear</h2>
      <div className={styles.grid}>
        {mensWearItems.map((item) => (
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