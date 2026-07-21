import type {
  DestinationBookingDatum,
  SeasonalTrendDatum,
  SatisfactionDatum,
  SiteStats,
} from "@/types";

export const siteStats: SiteStats = {
  happyCustomers: 3200,
  toursCompleted: 4800,
  destinationsCovered: 28,
  yearsOfExperience: 8,
};

export const destinationBookings: DestinationBookingDatum[] = [
  { destination: "Varanasi", destinationHi: "वाराणसी", bookings: 1420 },
  { destination: "Ayodhya", destinationHi: "अयोध्या", bookings: 1180 },
  { destination: "Manali", destinationHi: "मनाली", bookings: 980 },
  { destination: "Kerala", destinationHi: "केरल", bookings: 860 },
  { destination: "Kasol", destinationHi: "कसोल", bookings: 720 },
  { destination: "Prayagraj", destinationHi: "प्रयागराज", bookings: 640 },
];

export const seasonalTrends: SeasonalTrendDatum[] = [
  { month: "Jan", monthHi: "जन", bookings: 520 },
  { month: "Feb", monthHi: "फ़र", bookings: 680 },
  { month: "Mar", monthHi: "मार्च", bookings: 920 },
  { month: "Apr", monthHi: "अप्रैल", bookings: 760 },
  { month: "May", monthHi: "मई", bookings: 480 },
  { month: "Jun", monthHi: "जून", bookings: 360 },
  { month: "Jul", monthHi: "जुलाई", bookings: 320 },
  { month: "Aug", monthHi: "अग", bookings: 410 },
  { month: "Sep", monthHi: "सित", bookings: 580 },
  { month: "Oct", monthHi: "अक्टू", bookings: 880 },
  { month: "Nov", monthHi: "नव", bookings: 1040 },
  { month: "Dec", monthHi: "दिस", bookings: 860 },
];

export const satisfactionData: SatisfactionDatum[] = [
  { name: "Excellent", nameHi: "उत्कृष्ट", value: 72 },
  { name: "Good", nameHi: "अच्छा", value: 22 },
  { name: "Average", nameHi: "औसत", value: 5 },
  { name: "Poor", nameHi: "खराब", value: 1 },
];
