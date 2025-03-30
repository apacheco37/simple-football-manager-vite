import { CountryCode } from "./countries";

export const teamNames: {
  ["americas"]: { name: string; countryCode: CountryCode }[];
  ["europe"]: { name: string; countryCode: CountryCode }[];
  ["africa"]: { name: string; countryCode: CountryCode }[];
  ["asia"]: { name: string; countryCode: CountryCode }[];
} = {
  americas: [
    { name: "Buenos Aires Gauchos", countryCode: "AR" }, // Argentina – Gauchos are iconic Argentine cowboys
    { name: "Brasília Jaguars", countryCode: "BR" }, // Brazil – Jaguars are native to the Amazon
    { name: "Ottawa Lumberjacks", countryCode: "CA" }, // Canada – Lumber industry is significant
    { name: "Mexico City Aztecs", countryCode: "MX" }, // Mexico – Aztec civilization
    { name: "Washington Patriots", countryCode: "US" }, // USA – Reference to the American Revolution
    { name: "Lima Condors", countryCode: "PE" }, // Peru – Andean condor, national bird
    { name: "Santiago Miners", countryCode: "CL" }, // Chile – Mining is a major industry
    { name: "Bogotá Emeralds", countryCode: "CO" }, // Colombia – Colombia is the world’s top emerald producer
    { name: "Quito Volcanoes", countryCode: "EC" }, // Ecuador – Ecuador has many active volcanoes
    { name: "Caracas Llaneros", countryCode: "VE" }, // Venezuela – Llaneros are Venezuelan cowboys
    { name: "Havana Buccaneers", countryCode: "CU" }, // Cuba – Pirates historically roamed the Caribbean
    { name: "Asunción Guaraníes", countryCode: "PY" }, // Paraguay – Guaraní is an indigenous culture and language
    { name: "San José Hurricanes", countryCode: "CR" }, // Costa Rica – Caribbean hurricane influence
    { name: "Montevideo Celestes", countryCode: "UY" }, // Uruguay – Inspired by Uruguay’s national football team nickname
    { name: "La Paz Titans", countryCode: "BO" }, // Bolivia – Reference to Bolivia’s high altitude and strong indigenous heritage
    { name: "Port-au-Prince Voodoo", countryCode: "HT" }, // Haiti – Voodoo is deeply rooted in Haitian culture
  ],
  europe: [
    { name: "London Knights", countryCode: "UK" }, // UK – Medieval knights and history
    { name: "Paris Musketeers", countryCode: "FR" }, // France – Inspired by The Three Musketeers
    { name: "Rome Gladiators", countryCode: "IT" }, // Italy – Ancient Roman gladiators
    { name: "Berlin Eagles", countryCode: "DE" }, // Germany – The eagle is a national symbol
    { name: "Madrid Matadores", countryCode: "ES" }, // Spain – Traditional bullfighting
    { name: "Moscow Bears", countryCode: "RU" }, // Russia – Bears are a national symbol
    { name: "Athens Spartans", countryCode: "GR" }, // Greece – Ancient Spartan warriors
    { name: "Vienna Composers", countryCode: "AT" }, // Austria – Classical music heritage
    { name: "Dublin Shamrocks", countryCode: "IE" }, // Ireland – Shamrocks are a national emblem
    { name: "Stockholm Vikings", countryCode: "SE" }, // Sweden – Viking history
    { name: "Oslo Frosts", countryCode: "NO" }, // Norway – Cold climate and snow
    { name: "Warsaw Hussars", countryCode: "PL" }, // Poland – Winged Hussars, famous cavalry
    { name: "Lisbon Navigators", countryCode: "PT" }, // Portugal – Age of Exploration
    { name: "Helsinki Auroras", countryCode: "FI" }, // Finland – Northern lights
    { name: "Brussels Chocolatiers", countryCode: "BE" }, // Belgium – Famous for chocolate
    { name: "Amsterdam Tulips", countryCode: "NL" }, // Netherlands – Tulip heritage
  ],
  africa: [
    { name: "Cairo Pharaohs", countryCode: "EG" }, // Egypt – Ancient Pharaohs
    { name: "Nairobi Cheetahs", countryCode: "KE" }, // Kenya – Cheetahs are native to Kenya
    { name: "Dakar Lions", countryCode: "SN" }, // Senegal – Lions are a cultural symbol
    { name: "Pretoria Rhinos", countryCode: "ZA" }, // South Africa – Native wildlife, endangered rhinos
    { name: "Algiers Falcons", countryCode: "DZ" }, // Algeria – Falcons are common in the Sahara
    { name: "Luanda Warriors", countryCode: "AO" }, // Angola – Strong warrior traditions
    { name: "Accra Black Stars", countryCode: "GH" }, // Ghana – Inspired by Ghana’s national football team
    { name: "Kampala Cranes", countryCode: "UG" }, // Uganda – Grey crowned crane is the national bird
    { name: "Khartoum Crocodiles", countryCode: "SD" }, // Sudan – Nile crocodiles are widespread
    { name: "Addis Ababa Gazelles", countryCode: "ET" }, // Ethiopia – Gazelles are native to the region
    { name: "Rabat Atlas Lions", countryCode: "MA" }, // Morocco – Named after the national football team
    { name: "Antananarivo Lemurs", countryCode: "MG" }, // Madagascar – Lemurs are endemic to Madagascar
    { name: "Bamako Scorpions", countryCode: "ML" }, // Mali – Scorpions are common in the desert
    { name: "Abuja Vipers", countryCode: "NG" }, // Nigeria – Vipers are common in the region
    { name: "Maputo Mariners", countryCode: "MZ" }, // Mozambique – Coastal trade and maritime history
    { name: "Dodoma Leopards", countryCode: "TZ" }, // Tanzania – Big cats native to the Serengeti
  ],
  asia: [
    { name: "Tokyo Samurais", countryCode: "JP" }, // Japan – Samurai history
    { name: "Beijing Dragons", countryCode: "CN" }, // China – Dragons in Chinese mythology
    { name: "Delhi Cobras", countryCode: "IN" }, // India – Cobras are culturally significant
    { name: "Bangkok Elephants", countryCode: "TH" }, // Thailand – Elephants are national symbols
    { name: "Seoul Tigers", countryCode: "KR" }, // South Korea – The tiger is a national symbol
    { name: "Jakarta Krakatoas", countryCode: "ID" }, // Indonesia – Krakatoa is a famous volcano
    { name: "Bangkok Cobras", countryCode: "TH" }, // Thailand – Cobras are common in Thai culture
    { name: "Hanoi Phoenixes", countryCode: "VN" }, // Vietnam – Phoenix is a mythical symbol in Vietnamese culture
    { name: "Kuala Lumpur Hornbills", countryCode: "MY" }, // Malaysia – Rhinoceros hornbill is the national bird
    { name: "Manila Pearl Divers", countryCode: "PH" }, // Philippines – Pearls were historically traded
    { name: "Islamabad Falcons", countryCode: "PK" }, // Pakistan – Falcons are revered in Pakistan
    { name: "Ulaanbaatar Nomads", countryCode: "MN" }, // Mongolia – Mongolian nomadic culture
    { name: "Riyadh Falcons", countryCode: "SA" }, // Saudi Arabia – Falcons are highly valued
    { name: "Tashkent Silk Roaders", countryCode: "UZ" }, // Uzbekistan – Silk Road heritage
    { name: "Baku Flames", countryCode: "AZ" }, // Azerbaijan – Land of Fire, natural gas flames
    { name: "Yerevan Mountaineers", countryCode: "AM" }, // Armenia – Reference to Mount Ararat
  ],
};
