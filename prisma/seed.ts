import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

async function main() {
  await prisma.printJob.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("Admin@1234", 10);
  const customerHash = await bcrypt.hash("Taste@1234", 10);

  await prisma.user.create({
    data: {
      name: "Wokora Admin",
      phone: "9999999999",
      email: "ivan.p@example.net",
      passwordHash: adminHash,
      role: "admin",
      phoneVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      name: "Aarav Mehta",
      phone: "9876543210",
      email: "aarav@example.com",
      passwordHash: customerHash,
      role: "customer",
      phoneVerified: true,
      loyaltyPoints: 40,
    },
  });

  const categories = await Promise.all(
    [
      { name: "Burger", slug: "burger", sortOrder: 1 },
      { name: "Pizza", slug: "pizza", sortOrder: 2 },
      { name: "Chinese", slug: "chinese", sortOrder: 3 },
      { name: "Pasta", slug: "pasta", sortOrder: 4 },
      { name: "Sandwich", slug: "sandwich", sortOrder: 5 },
      { name: "Wraps", slug: "wraps", sortOrder: 6 },
      { name: "Mocktails", slug: "mocktails", sortOrder: 7 },
      { name: "Beverages", slug: "beverages", sortOrder: 8 },
    ].map((category) => prisma.category.create({ data: category }))
  );

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const items = [
    {
      name: "Classic Chicken Burger",
      slug: "classic-chicken-burger",
      category: "burger",
      description: "Crispy chicken fillet, house sauce, lettuce and toasted bun.",
      price: 189,
      imageUrl: img("1550547660-d9450f859349"),
      isVeg: false,
      isFeatured: true,
    },
    {
      name: "Peri Peri Burger",
      slug: "peri-peri-burger",
      category: "burger",
      description: "Spicy peri peri glaze, cheddar and pickled onions.",
      price: 219,
      imageUrl: img("1568901346375-23c9450c58cd"),
      isVeg: false,
      isFeatured: true,
    },
    {
      name: "Cheese Burst Burger",
      slug: "cheese-burst-burger",
      category: "burger",
      description: "Double cheese melt with a soft potato bun.",
      price: 199,
      imageUrl: img("1571091718767-18b5b1457add"),
      isVeg: true,
    },
    {
      name: "Veggie Deluxe Burger",
      slug: "veggie-deluxe-burger",
      category: "burger",
      description: "Crispy veg patty, slaw and smoky chipotle mayo.",
      price: 169,
      imageUrl: img("1520072959219-af1952f46417"),
      isVeg: true,
    },
    {
      name: "Double Patty Beast",
      slug: "double-patty-beast",
      category: "burger",
      description: "Two smash patties, cheddar, pickles and Wokora sauce.",
      price: 279,
      imageUrl: img("1553979459-d2229ba7433b"),
      isVeg: false,
      isFeatured: true,
    },
    {
      name: "Margherita",
      slug: "margherita-pizza",
      category: "pizza",
      description: "San Marzano tomato, fior di latte and basil.",
      price: 249,
      imageUrl: img("1513104890138-7c749659a591"),
      isVeg: true,
      isFeatured: true,
    },
    {
      name: "Farmhouse",
      slug: "farmhouse-pizza",
      category: "pizza",
      description: "Capsicum, onion, mushroom, tomato and olives.",
      price: 299,
      imageUrl: img("1548365328-9f547fb0953c"),
      isVeg: true,
    },
    {
      name: "BBQ Chicken Pizza",
      slug: "bbq-chicken-pizza",
      category: "pizza",
      description: "Smoky BBQ chicken, red onion and mozzarella.",
      price: 349,
      imageUrl: img("1565299624946-b28f40a0ae38"),
      isVeg: false,
      isFeatured: true,
    },
    {
      name: "Paneer Tikka Pizza",
      slug: "paneer-tikka-pizza",
      category: "pizza",
      description: "Tandoori paneer, peppers and mint drizzle.",
      price: 329,
      imageUrl: img("1574071318508-1cdbab80d002"),
      isVeg: true,
    },
    {
      name: "Pepperoni",
      slug: "pepperoni-pizza",
      category: "pizza",
      description: "Classic pepperoni cups and extra cheese.",
      price: 369,
      imageUrl: img("1604382354936-07c5d9983bd3"),
      isVeg: false,
    },
    {
      name: "Chicken Fried Rice",
      slug: "chicken-fried-rice",
      category: "chinese",
      description: "Wok-tossed rice, spring onion and soy butter.",
      price: 189,
      imageUrl: img("1603133872878-684f208fb84b"),
      isVeg: false,
      isFeatured: true,
    },
    {
      name: "Veg Hakka Noodles",
      slug: "veg-hakka-noodles",
      category: "chinese",
      description: "Street-style noodles with crunchy vegetables.",
      price: 169,
      imageUrl: img("1617093727343-374698b1b08d"),
      isVeg: true,
    },
    {
      name: "Chilli Chicken",
      slug: "chilli-chicken",
      category: "chinese",
      description: "Crispy boneless chicken in Indo-Chinese chilli sauce.",
      price: 229,
      imageUrl: img("1626804475297-294d7925ec38"),
      isVeg: false,
    },
    {
      name: "Veg Manchurian Dry",
      slug: "veg-manchurian-dry",
      category: "chinese",
      description: "Crispy veg balls tossed in garlic chilli glaze.",
      price: 199,
      imageUrl: img("1547592166-23ac45744acd"),
      isVeg: true,
    },
    {
      name: "Schezwan Fried Rice",
      slug: "schezwan-fried-rice",
      category: "chinese",
      description: "Fiery schezwan oil, veggies and toasted garlic.",
      price: 199,
      imageUrl: img("1512058564366-18510be2db19"),
      isVeg: true,
    },
    {
      name: "Arrabbiata",
      slug: "arrabbiata-pasta",
      category: "pasta",
      description: "Spicy tomato, chilli flakes and parmesan.",
      price: 219,
      imageUrl: img("1621996346565-e3dbc646d9a9"),
      isVeg: true,
    },
    {
      name: "Alfredo",
      slug: "alfredo-pasta",
      category: "pasta",
      description: "Creamy garlic alfredo with herbs.",
      price: 239,
      imageUrl: img("1551183053-bf91a1d81141"),
      isVeg: true,
      isFeatured: true,
    },
    {
      name: "Pink Sauce Pasta",
      slug: "pink-sauce-pasta",
      category: "pasta",
      description: "Tomato-cream sauce, basil and mozzarella.",
      price: 229,
      imageUrl: img("1473093297441-421c52902269"),
      isVeg: true,
    },
    {
      name: "Pesto Penne",
      slug: "pesto-penne",
      category: "pasta",
      description: "Basil pesto, roasted pine nuts and olive oil.",
      price: 249,
      imageUrl: img("1473093226795-2468db8c9969"),
      isVeg: true,
    },
    {
      name: "Club Sandwich",
      slug: "club-sandwich",
      category: "sandwich",
      description: "Triple-decker with chicken, egg, lettuce and fries.",
      price: 179,
      imageUrl: img("1528735602780-2552fd46c7af"),
      isVeg: false,
    },
    {
      name: "Grilled Cheese",
      slug: "grilled-cheese",
      category: "sandwich",
      description: " triple cheese pull on sourdough.",
      price: 149,
      imageUrl: img("1528736235302-52922df5c122"),
      isVeg: true,
    },
    {
      name: "Chicken Tikka Sandwich",
      slug: "chicken-tikka-sandwich",
      category: "sandwich",
      description: "Tandoori chicken, mint mayo and onions.",
      price: 199,
      imageUrl: img("1481070414801-51fd732d7184"),
      isVeg: false,
    },
    {
      name: "Chicken Caesar Wrap",
      slug: "chicken-caesar-wrap",
      category: "wraps",
      description: "Grilled chicken, parmesan and caesar dressing.",
      price: 189,
      imageUrl: img("1626700051175-6818013e1d4f"),
      isVeg: false,
    },
    {
      name: "Falafel Wrap",
      slug: "falafel-wrap",
      category: "wraps",
      description: "Crispy falafel, hummus and pickled slaw.",
      price: 169,
      imageUrl: img("1604467715878-8336bf0c66df"),
      isVeg: true,
    },
    {
      name: "Spicy Paneer Wrap",
      slug: "spicy-paneer-wrap",
      category: "wraps",
      description: "Peri paneer, peppers and garlic yoghurt.",
      price: 179,
      imageUrl: img("1565299585323-38d6b0865b47"),
      isVeg: true,
    },
    {
      name: "Virgin Mojito",
      slug: "virgin-mojito",
      category: "mocktails",
      description: "Mint, lime, soda and crushed ice.",
      price: 129,
      imageUrl: img("1546171753-97d7676e4602"),
      isVeg: true,
      isFeatured: true,
    },
    {
      name: "Blue Lagoon",
      slug: "blue-lagoon",
      category: "mocktails",
      description: "Blue curaçao syrup, lemon and lemonade.",
      price: 139,
      imageUrl: img("1536935338788-846bb9981813"),
      isVeg: true,
    },
    {
      name: "Watermelon Cooler",
      slug: "watermelon-cooler",
      category: "mocktails",
      description: "Fresh watermelon, mint and lime zest.",
      price: 119,
      imageUrl: img("1546173159-315724a31696"),
      isVeg: true,
    },
    {
      name: "Peach Iced Tea",
      slug: "peach-iced-tea",
      category: "mocktails",
      description: "House-brewed tea with peach puree.",
      price: 109,
      imageUrl: img("1497534447267-6d1913507858"),
      isVeg: true,
    },
    {
      name: "Cold Coffee",
      slug: "cold-coffee",
      category: "beverages",
      description: "Blended espresso, milk and ice cream top.",
      price: 129,
      imageUrl: img("1461026173541-45b9b7670c92"),
      isVeg: true,
    },
    {
      name: "Masala Lemonade",
      slug: "masala-lemonade",
      category: "beverages",
      description: "Spiced nimbu pani with black salt.",
      price: 89,
      imageUrl: img("1513555263279-1954fbb4846d"),
      isVeg: true,
    },
    {
      name: "Soft Drink",
      slug: "soft-drink",
      category: "beverages",
      description: "Chilled canned soda of your choice.",
      price: 59,
      imageUrl: img("1437412941545-e9e4b9bdaf35"),
      isVeg: true,
    },
  ];

  for (const item of items) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        slug: item.slug,
        categoryId: bySlug[item.category],
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isVeg: item.isVeg,
        isFeatured: Boolean(item.isFeatured),
      },
    });
  }

  console.log("Seeded Wokora Foods menu, admin and demo customer.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
