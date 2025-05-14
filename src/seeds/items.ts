import { connectDB } from "#config/db.js";
import { Item } from "#models/Item.js";

connectDB().catch((error: unknown) => {
  console.error("Database connection error:", error);
  process.exit(1);
});

await Item.deleteMany({});

await Item.insertMany([
  {
    category: "cafes",
    description: "Café espresso con leche vaporizada.",
    imgUrl: "/images/cafe-latte.jpg",
    name: "Café Latte",
    price: 45,
  },
  {
    category: "cafes",
    description: "Café con leche espumosa y un toque de cacao.",
    imgUrl: "/images/capuccino.jpg",
    name: "Café Capuchino",
    price: 48,
  },
  {
    category: "postres",
    description: "Brownie casero con nueces y cobertura de chocolate.",
    imgUrl: "/images/brownie.jpg",
    name: "Brownie de chocolate",
    price: 50,
  },
  {
    category: "desayunos",
    description: "Totopos bañados en salsa verde, con queso y crema.",
    imgUrl: "/images/chilaquiles.jpg",
    name: "Chilaquiles verdes",
    price: 70,
  },
  {
    category: "comida",
    description: "Sándwich con pechuga de pollo, lechuga y aderezo.",
    imgUrl: "/images/sandwich-pollo.jpg",
    name: "Sándwich de pollo",
    price: 65,
  },
  {
    category: "jugos",
    description: "Jugo natural de naranja recién exprimido.",
    imgUrl: "/images/jugo-naranja.jpg",
    name: "Jugo de naranja",
    price: 35,
  },
  {
    category: "jugos",
    description: "Jugo de espinaca, piña, nopal y apio.",
    imgUrl: "/images/jugo-verde.jpg",
    name: "Jugo verde",
    price: 40,
  },
  {
    category: "desayunos",
    description: "Pan con frijoles, queso gratinado y pico de gallo.",
    imgUrl: "/images/molletes.jpg",
    name: "Molletes",
    price: 55,
  },
]).catch((err: unknown) => {
  console.error("Error inserting items:", err);
});

process.exit(1);
// Close the database connection
