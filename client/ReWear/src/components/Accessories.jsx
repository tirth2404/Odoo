import React from "react";
import styles from "./CategoryGrid.module.css";

const accessoriesItems = [
  {
    name: "Belts",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Stylish belts to complete your look."
  },
  {
    name: "Hats",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Trendy hats for sun and style."
  },
  {
    name: "Watches",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Elegant watches for every wrist."
  },
  {
    name: "Sunglasses",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Protect your eyes in style."
  },
  {
    name: "Scarves",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Soft scarves for warmth and flair."
  },
  {
    name: "Bags",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Functional and fashionable bags."
  },
  {
    name: "Wallets",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Keep your essentials organized."
  },
  {
    name: "Jewelry",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Beautiful jewelry for every style."
  },
  {
    name: "Ties",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    desc: "Classic and modern ties for formal wear."
  },
  {
    name: "Gloves",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    desc: "Warm gloves for winter days."
  },
  {
    name: "Hair Accessories",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    desc: "Fun and functional hair accessories."
  }
];

export default function Accessories() {
  return (
    <div className={styles.categoryPage}>
      <h2 className={styles.categoryTitle}>Accessories</h2>
      <div className={styles.grid}>
        {accessoriesItems.map((item) => (
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