export const renewables = [
  "hydropower",
  "geothermal",
  "bioenergy",
  "solar",
  "wind",
  "pumping_up",
  "pumping_down",
  "battery_charge",
  "battery_generate",
  "solar_curtailment",
  "wind_curtailment"
];

export const non_renewables = [
  "nuclear",
  "thermal",
  "thermal_lng",
  "thermal_coal",
  "thermal_oil",
  "thermal_others",
  "others"
];

export const misc = ["demand", "spot_price"]

export const colors = {
  hydropower: 'blue',         // Blue
  geothermal: 'darkgray',     // Dark gray
  bioenergy: '#009933',       // Green
  solar: 'gold',              // Gold
  wind: '#99CCFF',            // Light blue
  pumping_up: '#FFB6C1',      // Light pink
  pumping_down: '#FFB6C1',    // Light pink
  battery_charge: '#DAB1DA',  // Light purple
  battery_generate: '#DAB1DA', // Light purple
  nuclear: '#FF0000',         // Red
  thermal_lng: '#FFDBBB',     // Yellow
  thermal_coal: '#808080',    // Gray
  thermal_oil: '#996633',     // Brown
  thermal_others: '#FFA500',  // Orange
  thermal: '#FFA500',  // Orange
  others: "#36454F",
  demand: "#000",
  spot_price: 'purple',
  solar_curtailment: 'yellow',
  wind_curtailment: '#40E0D0'
};

export const translations = {
  en: {
    // Legend items
    hydropower: 'Hydropower',
    geothermal: 'Geothermal',
    bioenergy: 'Bioenergy',
    solar: 'Solar',
    wind: 'Wind',
    pumping_up: 'Pumping Up',
    pumping_down: 'Pumping Down',
    battery_charge: 'Battery Charge',
    battery_generate: 'Battery Generate',
    nuclear: 'Nuclear',
    thermal_lng: 'LNG',
    thermal_coal: 'Coal',
    thermal_oil: 'Oil',
    thermal_others: 'Thermal Others',
    thermal: 'Thermal',
    others: 'Others',
    demand: 'Demand',
    spot_price: 'JEPX System Price',
    solar_curtailment: 'Solar Curtailment',
    wind_curtailment: 'Wind Curtailment',
    // Y-axis labels
    powerGeneration: 'Power Generation (GW)',
    systemPrice: 'JEPX System Price (JPY/kWh)',
    // Regions
    japan: 'Japan',
    tokyo: 'Tokyo',
    hokkaido: 'Hokkaido',
    tohuku: 'Tohoku',
    chubu: 'Chubu',
    hokuriku: 'Hokuriku',
    kansai: 'Kansai',
    chugoku: 'Chugoku',
    shikoku: 'Shikoku',
    kyushu: 'Kyushu'
  },
  jp: {
    // Legend items based on your image
    hydropower: '揚水(発力)',
    geothermal: '地熱',
    bioenergy: 'バイオエネルギー',
    solar: '太陽光',
    wind: '風力',
    pumping_up: '揚水(揚水)',
    pumping_down: '揚水(発電)',
    battery_charge: '蓄電池(充電)',
    battery_generate: '蓄電池(放電)',
    nuclear: '原子力',
    thermal_lng: 'LNG',
    thermal_coal: '石炭',
    thermal_oil: '石油',
    thermal_others: '火力その他',
    thermal: '火力',
    others: 'その他',
    demand: '需要',
    spot_price: 'JEPXシステムプライス',
    solar_curtailment: '太陽光(出力制御)',
    wind_curtailment: '風力(出力制御)',
    // Y-axis labels
    powerGeneration: '発電量 (GW)',
    systemPrice: 'JEPXシステムプライス (円/kWh)',
    // Regions
    japan: '全国',
    tokyo: '東京',
    hokkaido: '北海道',
    tohuku: '東北',
    chubu: '中部',
    hokuriku: '北陸',
    kansai: '関西',
    chugoku: '中国',
    shikoku: '四国',
    kyushu: '九州'
  }
};

export const regions = ['japan', 'tokyo', 'hokkaido', 'tohuku', 'chubu', 'hokuriku', 'kansai', 'chugoku', 'shikoku', 'kyushu'];