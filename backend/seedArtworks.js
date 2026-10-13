const mongoose = require("mongoose")
require("dotenv").config()

const Artwork = require("./models/Artwork")

const artworks = [
  {
    title: "Couple Under Umbrella",
    description: "A handmade miniature artwork depicting a couple under an umbrella.",
    image: "/images/couple-under-umbrella.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Ant",
    description: "A detailed miniature ant artwork created at an extremely small scale.",
    image: "/images/Ant.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Chain on Hair String",
    description: "A miniature chain artwork created on a single strand of hair.",
    image: "/images/chain-on-hair-string.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Chain with One Pencil",
    description: "A miniature chain artwork displayed alongside a pencil for scale.",
    image: "/images/chain-with-one-pencil.jpeg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Comb on Rice Grain",
    description: "A tiny handmade comb created on a single grain of rice.",
    image: "/images/comb-on-rice-grain.jpg",
    size: "Rice grain scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Couple in Park",
    description: "A miniature artwork depicting a couple spending time together in a park.",
    image: "/images/couple-in-park.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Elephant",
    description: "A detailed handmade elephant created at miniature scale.",
    image: "/images/elephant.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Ganesha on Pencil Tip",
    description: "A miniature Lord Ganesha artwork created on the tip of a pencil.",
    image: "/images/ganesha-on-pencil-tip.jpeg",
    size: "Pencil-tip scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Ganesha on Rice Grain",
    description: "A miniature Lord Ganesha artwork created on a grain of rice.",
    image: "/images/ganesha-on-rice-grain.jpg",
    size: "Rice grain scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Heart in Heart",
    description: "A miniature artwork featuring a heart within another heart.",
    image: "/images/heart-in-heart.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Heart",
    description: "A detailed handmade heart created at miniature scale.",
    image: "/images/heart.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Human DNA",
    description: "A miniature artwork inspired by the structure of human DNA.",
    image: "/images/human-dna.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "India Flag on Rice Grain",
    description: "A miniature Indian flag artwork created on a grain of rice.",
    image: "/images/india-flag-on-rice-grain.JPG",
    size: "Rice grain scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "India Map",
    description: "A detailed handmade map of India created at miniature scale.",
    image: "/images/india-map.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Ladder on Match Stick",
    description: "A miniature ladder artwork created on a match stick.",
    image: "/images/ladder-on-match-stick.jpg",
    size: "Match-stick scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Lord Krishna",
    description: "A detailed miniature artwork depicting Lord Krishna.",
    image: "/images/lord-krishna.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Miniature Christmas Scene",
    description: "A miniature Christmas scene featuring a Christmas tree and snowman.",
    image: "/images/microart-christmas-scale.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "My Name on 0.5mm Lead",
    description: "A personalized miniature name artwork created on pencil lead.",
    image: "/images/my-name-on-05mm-lead.jpg",
    size: "0.5 mm lead",
    category: "Personalized",
    featured: false,
  },
  {
    title: "Panda Painting on Rice Grain",
    description: "A miniature panda painting created on a grain of rice.",
    image: "/images/panda-painting-on-rice-grain.jpeg",
    size: "Rice grain scale",
    category: "MicroArt",
    featured: true,
  },
  {
    title: "Sad Boy Sitting Alone",
    description: "A miniature artwork depicting a boy sitting alone.",
    image: "/images/sad-boy-sitting-alone.jpg",
    size: "Miniature scale",
    category: "MicroArt",
    featured: true,
  },
]

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log("MongoDB connected")

    await Artwork.deleteMany({})

    await Artwork.insertMany(artworks)

    console.log(`${artworks.length} artworks inserted successfully`)

    await mongoose.disconnect()

    console.log("Database connection closed")
  } catch (error) {
    console.error("Seed error:", error.message)
    process.exit(1)
  }
}

seedDatabase()