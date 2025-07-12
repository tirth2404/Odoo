import React from "react";
import styles from "./CategoryGrid.module.css";

const kidsWearItems = [
  {
    name: "Rompers",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Adorable rompers for babies and toddlers."
  },
  {
    name: "Frocks",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Pretty frocks for little girls."
  },
  {
    name: "T-Shirts",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Fun and colorful t-shirts for kids."
  },
  {
    name: "Shorts",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Comfy shorts for playtime."
  },
  {
    name: "Dungarees",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Trendy dungarees for active kids."
  },
  {
    name: "Jackets",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Warm jackets for chilly days."
  },
  {
    name: "Sweaters",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Cozy sweaters for winter."
  },
  {
    name: "Pants",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Durable pants for everyday wear."
  },
  {
    name: "Skirts",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Cute skirts for little girls."
  },
  {
    name: "Ethnic Wear",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Traditional ethnic wear for kids."
  },
  {
    name: "Onesies",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Soft and comfy onesies for babies."
  },
  {
    name: "Hoodies",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Cool hoodies for stylish kids."
  }
];

export default function KidsWear() {
  return (
    <div className={styles.categoryPage}>
      <h2 className={styles.categoryTitle}>Kids' Wear</h2>
      <div className={styles.grid}>
        {kidsWearItems.map((item) => (
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