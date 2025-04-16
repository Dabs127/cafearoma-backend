import { connectDB } from "#config/db.js";
import { Promotion } from "#models/Promotion.js";

connectDB().catch((error: unknown) => {
  console.error("Database connection error:", error);
  process.exit(1);
});

await Promotion.deleteMany({});

await Promotion.insertMany([
  {
    endDate: new Date("2025-04-14"),
    imgUrl: "/images/promo-2x1-latte.jpg",
    longDescription:
      "Durante toda la semana, disfruta nuestra promoción especial de 2x1 en Café Latte. Perfecto para compartir o disfrutar el doble.",
    shortDescription: "Disfruta dos por uno en Café Latte",
    startDate: new Date("2025-04-08"),
    title: "2x1 en Café Latte",
  },
  {
    endDate: new Date("2025-04-25"),
    imgUrl: "/images/promo-viernes.jpg",
    longDescription:
      "Cada viernes del mes, al comprar cualquier bebida, recibe un desayuno gratis. Aplica en chilaquiles o molletes.",
    shortDescription: "Los viernes, el desayuno corre por nuestra cuenta",
    startDate: new Date("2025-04-04"),
    title: "Desayuno gratis el viernes",
  },
  {
    endDate: new Date("2025-04-20"),
    imgUrl: "/images/promo-jugo.jpg",
    longDescription:
      "En la compra de cualquier sándwich, te regalamos un jugo natural. Válido solo en consumo en tienda.",
    shortDescription: "Llévate un jugo gratis al comprar un sándwich",
    startDate: new Date("2025-04-10"),
    title: "Jugo gratis con tu sándwich",
  },
  {
    endDate: new Date("2025-04-30"),
    imgUrl: "/images/promo-brownie.jpg",
    longDescription:
      "Relájate por la tarde con un delicioso brownie. Compra uno y llévate otro gratis entre las 5:00 y 7:00 pm.",
    shortDescription: "De 5 a 7 pm, llévate 2 brownies por el precio de 1",
    startDate: new Date("2025-04-09"),
    title: "Brownie al 2x1 en la tarde",
  },
]).catch((err: unknown) => {
  console.error("Error inserting promotions:", err);
});

process.exit(1);
