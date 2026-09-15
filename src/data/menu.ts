const categoryImage = (slug: string) => `/images/categories/${slug}.png`;
const dishImage = (slug: string) => `/images/menu/${slug}.png`;

export const MENU_CATEGORIES = [
  { name: "Burger", slug: "burger", sortOrder: 1, image: categoryImage("burger") },
  { name: "Coffee", slug: "coffee", sortOrder: 2, image: categoryImage("coffee") },
  { name: "Momos", slug: "momos", sortOrder: 3, image: categoryImage("momos") },
  { name: "Spring Rolls", slug: "spring-rolls", sortOrder: 4, image: categoryImage("spring-rolls") },
  { name: "Noodles", slug: "noodles", sortOrder: 5, image: categoryImage("noodles") },
  { name: "Chilli Potato", slug: "chilli-potato", sortOrder: 6, image: categoryImage("chilli-potato") },
  { name: "Fried Rice", slug: "fried-rice", sortOrder: 7, image: categoryImage("fried-rice") },
  { name: "Wraps", slug: "wraps", sortOrder: 8, image: categoryImage("wraps") },
  { name: "Chicken Lollipop", slug: "chicken-lollipop", sortOrder: 9, image: categoryImage("chicken-lollipop") },
] as const;

export const ALLOWED_CATEGORY_SLUGS: string[] = MENU_CATEGORIES.map((row) => row.slug);

type MenuRow = {
  name: string;
  slug: string;
  category: (typeof MENU_CATEGORIES)[number]["slug"];
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isFeatured?: boolean;
};

function chickenName(category: MenuRow["category"], name: string) {
  if (category === "burger") return name.replace(/Burger$/, "Chicken Burger");
  if (category === "momos") return name.replace(/Momos$/, "Chicken Momos");
  if (category === "spring-rolls") return name.replace(/Spring Rolls$/, "Chicken Spring Rolls");
  if (category === "noodles") return `Chicken ${name}`;
  if (category === "fried-rice") return name.replace(/Fried Rice$/, "Chicken Fried Rice");
  if (category === "wraps") return name.replace(/Wrap$/, "Chicken Wrap");
  if (category === "chilli-potato") return name.replace(/Chilli Potato$/, "Chilli Chicken Potato");
  return `Chicken ${name}`;
}

function chickenDescription(category: MenuRow["category"], description: string) {
  const lead =
    category === "burger"
      ? "Juicy chicken patty. "
      : category === "momos"
        ? "Minced chicken filling. "
        : category === "spring-rolls"
          ? "Shredded chicken inside. "
          : category === "noodles"
            ? "Wok-tossed with chicken. "
            : category === "fried-rice"
              ? "Wok rice with chicken. "
              : category === "wraps"
                ? "Grilled chicken filling. "
                : category === "chilli-potato"
                  ? "Crispy potato tossed with chicken. "
                  : "Chicken. ";
  return `${lead}${description}`;
}

function vegOnly(
  category: MenuRow["category"],
  name: string,
  slug: string,
  description: string,
  price: number,
  imageUrl: string,
  options?: { isFeatured?: boolean }
): MenuRow[] {
  return [{ name, slug: `${slug}-veg`, category, description, price, imageUrl, isVeg: true, isFeatured: options?.isFeatured }];
}

function nvOnly(
  category: MenuRow["category"],
  name: string,
  slug: string,
  description: string,
  price: number,
  imageUrl: string,
  options?: { isFeatured?: boolean }
): MenuRow[] {
  return [{ name, slug: `${slug}-nv`, category, description, price, imageUrl, isVeg: false, isFeatured: options?.isFeatured }];
}

function pair(
  category: MenuRow["category"],
  name: string,
  slug: string,
  description: string,
  vegPrice: number,
  imageUrl: string,
  options?: { nvPrice?: number; isFeatured?: boolean; nvImageUrl?: string }
): MenuRow[] {
  const nvPrice = options?.nvPrice ?? vegPrice + 30;
  const nvImageUrl = options?.nvImageUrl ?? imageUrl;
  return [
    { name, slug: `${slug}-veg`, category, description, price: vegPrice, imageUrl, isVeg: true, isFeatured: options?.isFeatured },
    {
      name: chickenName(category, name),
      slug: `${slug}-nv`,
      category,
      description: chickenDescription(category, description),
      price: nvPrice,
      imageUrl: nvImageUrl,
      isVeg: false,
      isFeatured: options?.isFeatured,
    },
  ];
}

function burger(
  name: string,
  slug: string,
  description: string,
  vegPrice: number,
  options?: { nvPrice?: number; isFeatured?: boolean }
) {
  return pair("burger", name, slug, description, vegPrice, dishImage(`${slug}-veg`), {
    ...options,
    nvImageUrl: dishImage(`${slug}-nv`),
  });
}

export const MENU_ITEMS: MenuRow[] = [
  ...burger("Classic Burger", "classic-burger", "Toasted bun, house sauce, lettuce and a crisp patty.", 169, { isFeatured: true }),
  ...burger("Cheese Burst Burger", "cheese-burst-burger", "Molten cheese core, soft potato bun, Wokora sauce.", 199, { isFeatured: true }),
  ...burger("Peri Peri Burger", "peri-peri-burger", "Fiery peri peri glaze, cheddar and pickled onion.", 209),
  ...burger("Double Patty Burger", "double-patty-burger", "Two smash patties, cheddar, pickles and secret sauce.", 259, { isFeatured: true }),
  ...burger("Smash Burger", "smash-burger", "Thin griddle smash, caramelised edges, American cheese.", 219),
  ...burger("BBQ Burger", "bbq-burger", "Smoky barbecue glaze, onion crunch and cheddar.", 229),
  ...burger("Mexican Burger", "mexican-burger", "Jalapeño, salsa, nacho crunch and chipotle mayo.", 229),
  ...burger("Tandoori Burger", "tandoori-burger", "Tandoori masala patty, mint mayo and onion.", 219),
  ...burger("Loaded Burger", "loaded-burger", "Extra cheese, slaw, jalapeño and Wokora chilli dust.", 249),
  ...burger("Crunch Burger", "crunch-burger", "Crispy coating, slaw and honey-chilli drizzle.", 199),
  ...burger("Spicy Inferno Burger", "inferno-burger", "Ghost chilli mayo, pepper jack and pickle heat.", 239),
  ...burger("Mushroom Melt Burger", "mushroom-melt-burger", "Garlic mushrooms, swiss melt and herb butter bun.", 229),

  ...vegOnly("coffee", "Espresso", "espresso", "Double shot, dense crema, served short.", 99, dishImage("espresso")),
  ...vegOnly("coffee", "Americano", "americano", "Espresso stretched with hot water.", 109, dishImage("americano")),
  ...vegOnly("coffee", "Cappuccino", "cappuccino", "Equal espresso, steamed milk and foam.", 129, dishImage("cappuccino"), { isFeatured: true }),
  ...vegOnly("coffee", "Cafe Latte", "cafe-latte", "Silky steamed milk over a double shot.", 139, dishImage("cafe-latte")),
  ...vegOnly("coffee", "Cafe Mocha", "cafe-mocha", "Espresso, dark cocoa and steamed milk.", 149, dishImage("cafe-mocha")),
  ...vegOnly("coffee", "Cold Coffee", "cold-coffee", "Blended espresso, milk and ice, cream top.", 149, dishImage("cold-coffee"), { isFeatured: true }),
  ...vegOnly("coffee", "Filter Coffee", "filter-coffee", "South-Indian decoction, milk, served hot.", 89, dishImage("filter-coffee")),

  ...pair("momos", "Steamed Momos", "steamed-momos", "8 pieces, ginger-garlic filling, fiery red chutney.", 129, dishImage("steamed-momos"), { isFeatured: true }),
  ...pair("momos", "Fried Momos", "fried-momos", "Golden fried pleats, sesame dip.", 149, dishImage("fried-momos")),
  ...pair("momos", "Kurkure Momos", "kurkure-momos", "Crispy crumb coat, cheese pull, chilli oil.", 169, dishImage("kurkure-momos"), { isFeatured: true }),
  ...pair("momos", "Tandoori Momos", "tandoori-momos", "Charred, smoky, tossed in tandoori masala.", 179, dishImage("tandoori-momos")),
  ...pair("momos", "Chilli Momos", "chilli-momos", "Tossed in hot garlic, peppers and spring onion.", 189, dishImage("chilli-momos")),
  ...pair("momos", "Pan Fried Momos", "pan-fried-momos", "Crisp base, steamed top, soy-chilli dip.", 169, dishImage("pan-fried-momos")),
  ...pair("momos", "Afghani Momos", "afghani-momos", "Creamy malai marinade, mild heat, charcoal finish.", 199, dishImage("afghani-momos")),
  ...pair("momos", "Butter Momos", "butter-momos", "Butter-garlic toss, toasted sesame.", 189, dishImage("butter-momos")),

  ...pair("spring-rolls", "Classic Spring Rolls", "classic-spring-rolls", "Golden fried rolls, cabbage slaw, sweet chilli dip.", 139, dishImage("classic-spring-rolls"), { isFeatured: true }),
  ...pair("spring-rolls", "Cheese Spring Rolls", "cheese-spring-rolls", "Crispy wrapper, molten cheese, honey chilli dust.", 149, dishImage("cheese-spring-rolls")),
  ...pair("spring-rolls", "Schezwan Spring Rolls", "schezwan-spring-rolls", "Hot garlic toss, peppers, toasted sesame.", 159, dishImage("schezwan-spring-rolls")),
  ...pair("spring-rolls", "Crispy Spring Rolls", "crispy-spring-rolls", "Extra crunch, served with chilli garlic sauce.", 149, dishImage("crispy-spring-rolls")),

  ...pair("noodles", "Hakka Noodles", "hakka-noodles", "Street-style wok toss, crunchy vegetables, soy butter.", 169, dishImage("hakka-noodles"), { isFeatured: true }),
  ...pair("noodles", "Schezwan Noodles", "schezwan-noodles", "Fiery schezwan oil, toasted garlic, chilli crunch.", 189, dishImage("schezwan-noodles")),
  ...pair("noodles", "Chilli Garlic Noodles", "chilli-garlic-noodles", "Lots of garlic, dry red chilli, spring onion.", 189, dishImage("chilli-garlic-noodles")),
  ...pair("noodles", "Singapore Noodles", "singapore-noodles", "Curry-scented wok noodles, peppers and egg-style toss.", 199, dishImage("singapore-noodles")),
  ...pair("noodles", "Pan Fried Noodles", "pan-fried-noodles", "Crisp nest, brown gravy, wok vegetables.", 209, dishImage("pan-fried-noodles")),
  ...pair("noodles", "Garlic Butter Noodles", "garlic-butter-noodles", "Butter, garlic, white pepper and herbs.", 179, dishImage("garlic-butter-noodles")),

  ...pair("chilli-potato", "Honey Chilli Potato", "honey-chilli-potato", "Crispy fingers, honey, sesame, spring onion.", 179, dishImage("honey-chilli-potato"), { isFeatured: true }),
  ...pair("chilli-potato", "Dry Chilli Potato", "dry-chilli-potato", "Indo-Chinese classic, extra crunch, no gravy.", 169, dishImage("dry-chilli-potato")),
  ...pair("chilli-potato", "Schezwan Chilli Potato", "schezwan-chilli-potato", "Schezwan paste, garlic, toasted sesame.", 189, dishImage("schezwan-chilli-potato")),
  ...pair("chilli-potato", "Garlic Chilli Potato", "garlic-chilli-potato", "Burnt garlic, dry chilli and salt-pepper.", 179, dishImage("garlic-chilli-potato")),

  ...pair("fried-rice", "Classic Fried Rice", "classic-fried-rice", "Wok-charred rice, light soy, spring onion.", 159, dishImage("classic-fried-rice"), { isFeatured: true }),
  ...pair("fried-rice", "Schezwan Fried Rice", "schezwan-fried-rice", "Red chilli paste, crunch, smoke.", 179, dishImage("schezwan-fried-rice")),
  ...pair("fried-rice", "Burnt Garlic Fried Rice", "burnt-garlic-fried-rice", "Toasted garlic oil, white pepper, greens.", 169, dishImage("burnt-garlic-fried-rice")),
  ...pair("fried-rice", "Chilli Fried Rice", "chilli-fried-rice", "Hot garlic, dry chilli, wok vegetables.", 179, dishImage("chilli-fried-rice")),
  ...pair("fried-rice", "Hong Kong Fried Rice", "hong-kong-fried-rice", "Sweet-savoury wok rice, peppers and sesame.", 189, dishImage("hong-kong-fried-rice")),

  ...pair("wraps", "Classic Wrap", "classic-wrap", "Warm tortilla, slaw, house sauce, toasted close.", 169, dishImage("classic-wrap"), { isFeatured: true }),
  ...pair("wraps", "Peri Peri Wrap", "peri-peri-wrap", "Peri glaze, peppers, cheddar and mint mayo.", 189, dishImage("peri-peri-wrap")),
  ...pair("wraps", "Cheese Melt Wrap", "cheese-melt-wrap", "Triple cheese pull, jalapeño, garlic yoghurt.", 179, dishImage("cheese-melt-wrap")),
  ...pair("wraps", "Schezwan Wrap", "schezwan-wrap", "Schezwan heat, onion crunch and sesame.", 189, dishImage("schezwan-wrap")),
  ...pair("wraps", "Loaded Wrap", "loaded-wrap", "Extra filling, cheese, slaw and chilli dust.", 209, dishImage("loaded-wrap")),

  ...nvOnly("chicken-lollipop", "Classic Lollipop", "classic-lollipop", "Frenched drumettes, crisp coat, chilli garlic dip.", 229, dishImage("classic-lollipop"), { isFeatured: true }),
  ...nvOnly("chicken-lollipop", "Schezwan Lollipop", "schezwan-lollipop", "Tossed in schezwan, sesame and spring onion.", 249, dishImage("schezwan-lollipop")),
  ...nvOnly("chicken-lollipop", "Dry Lollipop", "dry-lollipop", "Salt-pepper crust, no gravy, extra crunch.", 239, dishImage("dry-lollipop")),
  ...nvOnly("chicken-lollipop", "Gravy Lollipop", "gravy-lollipop", "Hot garlic gravy, peppers, served saucy.", 259, dishImage("gravy-lollipop")),
  ...nvOnly("chicken-lollipop", "Crispy Lollipop", "crispy-lollipop", "Double fry, honey chilli drizzle.", 249, dishImage("crispy-lollipop")),
];
