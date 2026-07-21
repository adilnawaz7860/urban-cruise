import type { Destination } from "@/types";

export const destinations: Destination[] = [
  {
    id: "varanasi",
    slug: "varanasi",
    name: "Varanasi",
    nameHi: "वाराणसी",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop",
    packageCount: 12,
    startingPrice: 2999,
    description: "India's spiritual capital — sacred Ganga ghats, ancient temples and evening aarti.",
    descriptionHi: "भारत की आध्यात्मिक राजधानी — पवित्र गंगा घाट, प्राचीन मंदिर और संध्या आरती।",
  },
  {
    id: "ayodhya",
    slug: "ayodhya",
    name: "Ayodhya",
    nameHi: "अयोध्या",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop",
    packageCount: 10,
    startingPrice: 4499,
    description: "Birthplace of Lord Ram — home of the grand new Ram Mandir and Sarayu River.",
    descriptionHi: "भगवान राम की जन्मभूमि — भव्य नए राम मंदिर और सरयू नदी का पवित्र स्थल।",
  },
  {
    id: "lucknow",
    slug: "lucknow",
    name: "Lucknow",
    nameHi: "लखनऊ",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop",
    packageCount: 8,
    startingPrice: 2999,
    description: "City of Nawabs — Bara Imambara, Rumi Darwaza, kebabs and royal Awadhi culture.",
    descriptionHi: "नवाबों का शहर — बड़ा इमामबाड़ा, रूमी दरवाज़ा, कबाब और शाही अवधी संस्कृति।",
  },
  {
    id: "prayagraj",
    slug: "prayagraj",
    name: "Prayagraj",
    nameHi: "प्रयागराज",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1512036666432-2181c1f26420?q=80&w=1200&auto=format&fit=crop",
    packageCount: 9,
    startingPrice: 3499,
    description: "Triveni Sangam — where Ganga, Yamuna and Saraswati meet, sacred Kumbh Mela city.",
    descriptionHi: "त्रिवेणी संगम — जहाँ गंगा, यमुना और सरस्वती मिलती हैं, पवित्र कुंभ नगरी।",
  },
  {
    id: "mathura-vrindavan",
    slug: "mathura-vrindavan",
    name: "Mathura & Vrindavan",
    nameHi: "मथुरा एवं वृंदावन",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1592495989226-03f88104f8cc?q=80&w=1200&auto=format&fit=crop",
    packageCount: 11,
    startingPrice: 7499,
    description: "Krishna's sacred birthplace — colourful temples, Holi celebrations and divine braj.",
    descriptionHi: "भगवान कृष्ण की पवित्र जन्मभूमि — रंगीन मंदिर, होली उत्सव और दिव्य ब्रज।",
  },
  {
    id: "shimla-manali",
    slug: "shimla-manali",
    name: "Shimla & Manali",
    nameHi: "शिमला एवं मनाली",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
    packageCount: 14,
    startingPrice: 13999,
    description: "Snow-capped Himalayas, colonial hill stations and thrilling adventure sports.",
    descriptionHi: "बर्फ से ढके हिमालय, औपनिवेशिक हिल स्टेशन और रोमांचकारी एडवेंचर स्पोर्ट्स।",
  },
  {
    id: "kasol",
    slug: "kasol",
    name: "Kasol",
    nameHi: "कसोल",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    packageCount: 8,
    startingPrice: 9999,
    description: "Himachal's backpacker paradise — Parvati Valley, riverside camps and scenic treks.",
    descriptionHi: "हिमाचल का बैकपैकर स्वर्ग — पार्वती वैली, नदी किनारे कैंप और खूबसूरत ट्रेक।",
  },
  {
    id: "kerala",
    slug: "kerala",
    name: "Kerala",
    nameHi: "केरल",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=1200&auto=format&fit=crop",
    packageCount: 16,
    startingPrice: 18999,
    description: "Tranquil backwaters, lush Munnar tea gardens, houseboats and Ayurvedic wellness.",
    descriptionHi: "शांत बैकवाटर, हरे-भरे मुन्नार के चाय बागान, हाउसबोट और आयुर्वेदिक वेलनेस।",
  },
];

export const getDestinationBySlug = (slug: string) =>
  destinations.find((d) => d.slug === slug);
