#!/usr/bin/env node
"use strict";

require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Admin = require("../models/Admin.model");
const Package = require("../models/Package.model");
const Settings = require("../models/Settings.model");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/urban_cruise");
  console.log("Connected to MongoDB");

  const adminOnly = process.argv.includes("--admin-only");

  // ─── Super Admin ──────────────────────────────────────────────────────────
  const existingAdmin = await Admin.findOne({ email: process.env.SEED_ADMIN_EMAIL });
  if (!existingAdmin) {
    await Admin.create({
      name: process.env.SEED_ADMIN_NAME || "Super Admin",
      email: process.env.SEED_ADMIN_EMAIL || "admin@urbancruiselko.com",
      password: process.env.SEED_ADMIN_PASSWORD || "Admin@1234",
      role: "super_admin",
    });
    console.log("✓ Super admin created:", process.env.SEED_ADMIN_EMAIL);
  } else {
    console.log("- Super admin already exists, skipping");
  }

  if (adminOnly) {
    await mongoose.disconnect();
    return;
  }

  // ─── Settings ─────────────────────────────────────────────────────────────
  await Settings.findOneAndUpdate(
    { key: "global" },
    {
      key: "global",
      siteName: "Urban Cruise",
      tagline: "Lucknow's Most Trusted Travel Agency",
      email: "info@urbancruiselko.com",
      phone: "+91 92609 94765",
      whatsapp: "919260994765",
      address: "Vineet Khand 6, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
      social: {
        facebook: "https://facebook.com/urbancruiselko",
        instagram: "https://instagram.com/urbancruiselko",
        youtube: "https://youtube.com/@urbancruiselko",
        twitter: "https://twitter.com/urbancruiselko",
      },
    },
    { upsert: true }
  );
  console.log("✓ Settings seeded");

  // ─── Packages ─────────────────────────────────────────────────────────────
  const existingCount = await Package.countDocuments();
  if (existingCount === 0) {
    const admin = await Admin.findOne({ role: "super_admin" });

    const packages = [
      {
        title: "Varanasi Ganga Darshan",
        slug: "varanasi-ganga-darshan-1n2d",
        destination: "Varanasi",
        shortDescription: "India's spiritual capital — sacred Ganga ghats, evening aarti and ancient temples.",
        durationDays: 2,
        durationNights: 1,
        price: 2999,
        discountPrice: 2999,
        discountPercent: 25,
        categories: ["domestic", "family", "group", "pilgrimage"],
        featured: true,
        bestSeller: true,
        status: "published",
        rating: 4.9,
        reviewCount: 1184,
        inclusions: ["Hotel accommodation", "Daily breakfast", "Ganga Aarti tour", "Kashi Vishwanath darshan", "Private cab transfers"],
        exclusions: ["Airfare", "Lunch & dinner", "Personal expenses"],
        itinerary: [
          { day: 1, title: "Arrival & Ganga Aarti", description: "Arrive at Varanasi. Check-in. Evening Ganga Aarti at Dashashwamedh Ghat.", activities: ["Hotel check-in", "Ganga Aarti"] },
          { day: 2, title: "Kashi Darshan & Departure", description: "Morning boat ride on Ganga. Kashi Vishwanath temple darshan. Departure.", activities: ["Morning boat ride", "Kashi Vishwanath", "Departure transfer"] },
        ],
        createdBy: admin?._id,
      },
      {
        title: "Ayodhya Ram Mandir Tour",
        slug: "ayodhya-ram-mandir-tour-1n2d",
        destination: "Ayodhya",
        shortDescription: "Birthplace of Lord Ram — visit the grand Ram Mandir and Sarayu ghats.",
        durationDays: 2,
        durationNights: 1,
        price: 4499,
        discountPrice: 4499,
        discountPercent: 25,
        categories: ["domestic", "family", "group", "pilgrimage"],
        featured: true,
        bestSeller: true,
        status: "published",
        rating: 4.9,
        reviewCount: 876,
        inclusions: ["Hotel accommodation", "Daily breakfast", "Ram Mandir darshan", "Private cab transfers", "Local guide"],
        exclusions: ["Airfare", "Lunch & dinner", "Personal expenses"],
        itinerary: [
          { day: 1, title: "Arrival & Ram Mandir", description: "Arrive at Ayodhya. Ram Mandir darshan. Kanak Bhawan & Hanuman Garhi visit.", activities: ["Ram Mandir darshan", "Kanak Bhawan", "Hotel check-in"] },
          { day: 2, title: "Sarayu Ghat & Departure", description: "Morning aarti at Sarayu Ghat. Sightseeing. Departure.", activities: ["Sarayu Ghat aarti", "Departure transfer"] },
        ],
        createdBy: admin?._id,
      },
      {
        title: "Kerala Backwaters & Munnar",
        slug: "kerala-backwaters-munnar-5n6d",
        destination: "Kerala",
        shortDescription: "Tranquil backwaters, Munnar tea gardens, houseboats and Ayurvedic wellness.",
        durationDays: 6,
        durationNights: 5,
        price: 18999,
        discountPrice: 18999,
        discountPercent: 24,
        categories: ["domestic", "honeymoon", "family"],
        featured: false,
        bestSeller: true,
        status: "published",
        rating: 4.9,
        reviewCount: 892,
        inclusions: ["5 nights accommodation", "Daily breakfast", "Houseboat stay", "Munnar sightseeing", "Private cab transfers", "Airport pick-up & drop"],
        exclusions: ["Airfare", "Lunch & dinner", "Personal expenses"],
        createdBy: admin?._id,
      },
      {
        title: "Manali Snow Adventure",
        slug: "manali-snow-trip-4n5d",
        destination: "Manali, Himachal Pradesh",
        shortDescription: "Snow-capped peaks, Solang Valley snow activities and Rohtang Pass adventure.",
        durationDays: 5,
        durationNights: 4,
        price: 13999,
        discountPrice: 13999,
        discountPercent: 22,
        categories: ["domestic", "adventure", "family"],
        featured: false,
        bestSeller: true,
        status: "published",
        rating: 4.8,
        reviewCount: 724,
        inclusions: ["4 nights hotel", "Daily breakfast", "Rohtang Pass excursion", "Solang Valley activities", "Private cab from Lucknow"],
        exclusions: ["Airfare", "Lunch & dinner", "Adventure activity fees", "Personal expenses"],
        createdBy: admin?._id,
      },
    ];

    await Package.insertMany(packages);
    console.log(`✓ ${packages.length} packages seeded`);
  } else {
    console.log(`- ${existingCount} packages already exist, skipping`);
  }

  await mongoose.disconnect();
  console.log("\n✅ Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
