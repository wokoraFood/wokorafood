const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

export const MENU_CATEGORIES = [
  { name: "Burger", slug: "burger", sortOrder: 1, emoji: "🍔", image: pexels(1639557) },
  { name: "Momos", slug: "momos", sortOrder: 2, emoji: "🥟", image: pexels(5409015) },
  { name: "Dimsum", slug: "dimsum", sortOrder: 3, emoji: "🍱", image: pexels(5409022) },
  { name: "Spring Rolls", slug: "spring-rolls", sortOrder: 4, emoji: "🥠", image: pexels(725991) },
  { name: "Noodles", slug: "noodles", sortOrder: 5, emoji: "🍜", image: pexels(2347311) },
  { name: "Chilli Potato", slug: "chilli-potato", sortOrder: 6, emoji: "🌶️", image: pexels(1583884) },
  { name: "Fried Rice", slug: "fried-rice", sortOrder: 7, emoji: "🍚", image: pexels(723198) },
  { name: "Manchurian", slug: "manchurian", sortOrder: 8, emoji: "🥗", image: pexels(2474661) },
  { name: "Pasta", slug: "pasta", sortOrder: 9, emoji: "🍝", image: pexels(1279330) },
  { name: "Sandwich", slug: "sandwich", sortOrder: 10, emoji: "🥪", image: pexels(1603901) },
  { name: "Wraps", slug: "wraps", sortOrder: 11, emoji: "🌯", image: pexels(461198) },
  { name: "Mocktails", slug: "mocktails", sortOrder: 12, emoji: "🍹", image: pexels(1187766) },
  { name: "Beverages", slug: "beverages", sortOrder: 13, emoji: "☕", image: pexels(312418) },
] as const;

export const MENU_ITEMS = [
  { name: "Classic Chicken Burger", slug: "classic-chicken-burger", category: "burger", description: "Crispy chicken fillet, house sauce, lettuce and toasted bun.", price: 189, imageUrl: pexels(1639557), isVeg: false, isFeatured: true },
  { name: "Peri Peri Burger", slug: "peri-peri-burger", category: "burger", description: "Spicy peri peri glaze, cheddar and pickled onions.", price: 219, imageUrl: pexels(1633578), isVeg: false, isFeatured: true },
  { name: "Cheese Burst Burger", slug: "cheese-burst-burger", category: "burger", description: "Double cheese melt with a soft potato bun.", price: 199, imageUrl: pexels(2983101), isVeg: true },
  { name: "Veggie Deluxe Burger", slug: "veggie-deluxe-burger", category: "burger", description: "Crispy veg patty, slaw and smoky chipotle mayo.", price: 169, imageUrl: pexels(3616956), isVeg: true },
  { name: "Double Patty Beast", slug: "double-patty-beast", category: "burger", description: "Two smash patties, cheddar, pickles and Wokora sauce.", price: 279, imageUrl: pexels(70497), isVeg: false, isFeatured: true },

  { name: "Steamed Veg Momos", slug: "steamed-veg-momos", category: "momos", description: "8 pieces, ginger-garlic filling, fiery red chutney.", price: 129, imageUrl: pexels(5409015), isVeg: true, isFeatured: true },
  { name: "Chicken Momos", slug: "chicken-momos", category: "momos", description: "Juicy minced chicken, sesame dip.", price: 159, imageUrl: pexels(5409010), isVeg: false, isFeatured: true },
  { name: "Tandoori Momos", slug: "tandoori-momos", category: "momos", description: "Charred, smoky, tossed in tandoori masala.", price: 179, imageUrl: pexels(5409023), isVeg: false },
  { name: "Kurkure Momos", slug: "kurkure-momos", category: "momos", description: "Crispy fried wrap with cheese pull.", price: 169, imageUrl: pexels(5409012), isVeg: true },

  { name: "Prawn Dimsum", slug: "prawn-dimsum", category: "dimsum", description: "Translucent wrappers, steamed to order.", price: 219, imageUrl: pexels(5409022), isVeg: false, isFeatured: true },
  { name: "Veg Crystal Dimsum", slug: "veg-crystal-dimsum", category: "dimsum", description: "Water chestnut, mushroom and bamboo shoot.", price: 189, imageUrl: pexels(5409017), isVeg: true },
  { name: "Chicken Siu Mai", slug: "chicken-siu-mai", category: "dimsum", description: "Open-top dumplings with soy-chilli oil.", price: 199, imageUrl: pexels(2664216), isVeg: false },

  { name: "Veg Spring Rolls", slug: "veg-spring-rolls", category: "spring-rolls", description: "Golden rolls, cabbage slaw, sweet chilli.", price: 139, imageUrl: pexels(725991), isVeg: true, isFeatured: true },
  { name: "Chicken Spring Rolls", slug: "chicken-spring-rolls", category: "spring-rolls", description: "Shredded chicken, peppers, crispy wrapper.", price: 159, imageUrl: pexels(955137), isVeg: false },
  { name: "Cheese Spring Rolls", slug: "cheese-spring-rolls", category: "spring-rolls", description: "Molten cheese, herbs, honey chilli dust.", price: 149, imageUrl: pexels(4518843), isVeg: true },

  { name: "Veg Hakka Noodles", slug: "veg-hakka-noodles", category: "noodles", description: "Street-style wok toss, crunchy vegetables.", price: 169, imageUrl: pexels(2347311), isVeg: true, isFeatured: true },
  { name: "Chicken Hakka Noodles", slug: "chicken-hakka-noodles", category: "noodles", description: "Soy butter, spring onion, tender chicken.", price: 199, imageUrl: pexels(1907244), isVeg: false },
  { name: "Schezwan Noodles", slug: "schezwan-noodles", category: "noodles", description: "Fiery schezwan oil and toasted garlic.", price: 189, imageUrl: pexels(7613568), isVeg: true },
  { name: "Pan Fried Noodles", slug: "pan-fried-noodles", category: "noodles", description: "Crisp nest, gravy, wok vegetables.", price: 209, imageUrl: pexels(2664216), isVeg: false },

  { name: "Honey Chilli Potato", slug: "honey-chilli-potato", category: "chilli-potato", description: "Crispy fingers, honey, sesame, spring onion.", price: 179, imageUrl: pexels(1583884), isVeg: true, isFeatured: true },
  { name: "Dry Chilli Potato", slug: "dry-chilli-potato", category: "chilli-potato", description: "Indo-Chinese classic, extra crunch.", price: 169, imageUrl: pexels(1893555), isVeg: true },
  { name: "Loaded Chilli Fries", slug: "loaded-chilli-fries", category: "chilli-potato", description: "Cheese, jalapeño, Wokora chilli dust.", price: 189, imageUrl: pexels(1896054), isVeg: true },

  { name: "Chicken Fried Rice", slug: "chicken-fried-rice", category: "fried-rice", description: "Wok-charred rice, egg, spring onion.", price: 189, imageUrl: pexels(723198), isVeg: false, isFeatured: true },
  { name: "Veg Fried Rice", slug: "veg-fried-rice", category: "fried-rice", description: "Garden veg, light soy, toasted garlic.", price: 159, imageUrl: pexels(1624487), isVeg: true },
  { name: "Schezwan Fried Rice", slug: "schezwan-fried-rice", category: "fried-rice", description: "Red chilli paste, crunch, smoke.", price: 179, imageUrl: pexels(1640772), isVeg: true },
  { name: "Egg Fried Rice", slug: "egg-fried-rice", category: "fried-rice", description: "Fluffy egg ribbons, white pepper.", price: 169, imageUrl: pexels(1410235), isVeg: false },

  { name: "Veg Manchurian Dry", slug: "veg-manchurian-dry", category: "manchurian", description: "Crispy veg balls, garlic chilli glaze.", price: 199, imageUrl: pexels(2474661), isVeg: true, isFeatured: true },
  { name: "Veg Manchurian Gravy", slug: "veg-manchurian-gravy", category: "manchurian", description: "Silky brown sauce, perfect with fried rice.", price: 209, imageUrl: pexels(1099680), isVeg: true },
  { name: "Chicken Manchurian", slug: "chicken-manchurian", category: "manchurian", description: "Boneless chicken, hot garlic, sesame.", price: 229, imageUrl: pexels(2338407), isVeg: false },
  { name: "Gobi Manchurian", slug: "gobi-manchurian", category: "manchurian", description: "Cauliflower florets, extra crisp.", price: 189, imageUrl: pexels(1437267), isVeg: true },

  { name: "Arrabbiata", slug: "arrabbiata-pasta", category: "pasta", description: "Spicy tomato, chilli flakes and parmesan.", price: 219, imageUrl: pexels(1279330), isVeg: true },
  { name: "Alfredo", slug: "alfredo-pasta", category: "pasta", description: "Creamy garlic alfredo with herbs.", price: 239, imageUrl: pexels(1437267), isVeg: true, isFeatured: true },
  { name: "Pink Sauce Pasta", slug: "pink-sauce-pasta", category: "pasta", description: "Tomato-cream sauce, basil and mozzarella.", price: 229, imageUrl: pexels(1487511), isVeg: true },

  { name: "Club Sandwich", slug: "club-sandwich", category: "sandwich", description: "Triple-decker with chicken, egg, lettuce.", price: 179, imageUrl: pexels(1603901), isVeg: false },
  { name: "Grilled Cheese", slug: "grilled-cheese", category: "sandwich", description: "Triple cheese pull on sourdough.", price: 149, imageUrl: pexels(1647163), isVeg: true },
  { name: "Chicken Tikka Sandwich", slug: "chicken-tikka-sandwich", category: "sandwich", description: "Tandoori chicken, mint mayo and onions.", price: 199, imageUrl: pexels(1633525), isVeg: false },

  { name: "Chicken Caesar Wrap", slug: "chicken-caesar-wrap", category: "wraps", description: "Grilled chicken, parmesan and caesar dressing.", price: 189, imageUrl: pexels(461198), isVeg: false },
  { name: "Falafel Wrap", slug: "falafel-wrap", category: "wraps", description: "Crispy falafel, hummus and pickled slaw.", price: 169, imageUrl: pexels(461198), isVeg: true },
  { name: "Spicy Paneer Wrap", slug: "spicy-paneer-wrap", category: "wraps", description: "Peri paneer, peppers and garlic yoghurt.", price: 179, imageUrl: pexels(1059905), isVeg: true },

  { name: "Virgin Mojito", slug: "virgin-mojito", category: "mocktails", description: "Mint, lime, soda and crushed ice.", price: 129, imageUrl: pexels(1187766), isVeg: true, isFeatured: true },
  { name: "Blue Lagoon", slug: "blue-lagoon", category: "mocktails", description: "Blue curaçao syrup, lemon and lemonade.", price: 139, imageUrl: pexels(1283219), isVeg: true },
  { name: "Watermelon Cooler", slug: "watermelon-cooler", category: "mocktails", description: "Fresh watermelon, mint and lime zest.", price: 119, imageUrl: pexels(1337825), isVeg: true },

  { name: "Cold Coffee", slug: "cold-coffee", category: "beverages", description: "Blended espresso, milk and ice cream top.", price: 129, imageUrl: pexels(312418), isVeg: true },
  { name: "Masala Lemonade", slug: "masala-lemonade", category: "beverages", description: "Spiced nimbu pani with black salt.", price: 89, imageUrl: pexels(96974), isVeg: true },
  { name: "Soft Drink", slug: "soft-drink", category: "beverages", description: "Chilled canned soda of your choice.", price: 59, imageUrl: pexels(50593), isVeg: true },
] as const;
