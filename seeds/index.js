const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "65ae41ce7e9b576ed09edff0",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: `https://source.unsplash.com/random/300x300?camping,${i * 2}`,
          filename: `${i * 2}`,
        },
        {
          url: `https://source.unsplash.com/random/300x300?camping,${
            i * 2 + 1
          }`,
          filename: `${i + 1}`,
        },
        {
          url: `https://source.unsplash.com/random/300x300?camping,${
            i * 2 + 2
          }`,
          filename: `${i + 2}`,
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis rerum provident sed, non alias quaerat consequatur, voluptate ratione molestiae tempore perferendis ab inventore recusandae et pariatur iusto nesciunt vel ducimus.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => db.close());
