export interface BasinGeoJSON {
  name: string;
  coordinates: [number, number][];
  center: [number, number];
  zoom: number;
}

export const basinGeoData: Record<string, BasinGeoJSON> = {
  "Pasig-Marikina": {
    name: "Pasig-Marikina River Basin",
    coordinates: [
      [120.85, 14.55], [120.95, 14.50], [121.05, 14.52], [121.10, 14.58],
      [121.08, 14.65], [121.00, 14.70], [120.95, 14.68], [120.88, 14.62], [120.85, 14.55]
    ],
    center: [120.97, 14.60],
    zoom: 10
  },
  "Laguna de Bay": {
    name: "Laguna de Bay Basin",
    coordinates: [
      [120.90, 14.20], [121.10, 14.15], [121.30, 14.20], [121.40, 14.35],
      [121.35, 14.50], [121.20, 14.55], [121.00, 14.50], [120.85, 14.40],
      [120.82, 14.28], [120.90, 14.20]
    ],
    center: [121.10, 14.35],
    zoom: 10
  },
  "Tullahan River": {
    name: "Tullahan River Basin",
    coordinates: [
      [120.90, 14.72], [121.00, 14.70], [121.08, 14.73], [121.10, 14.78],
      [121.05, 14.85], [120.98, 14.88], [120.92, 14.82], [120.88, 14.76], [120.90, 14.72]
    ],
    center: [121.00, 14.78],
    zoom: 11
  },
  "Pampanga Basin": {
    name: "Pampanga River Basin",
    coordinates: [
      [120.40, 15.00], [120.60, 14.80], [120.85, 14.75], [121.10, 14.90],
      [121.20, 15.10], [121.15, 15.40], [120.95, 15.60], [120.70, 15.55],
      [120.50, 15.40], [120.35, 15.20], [120.40, 15.00]
    ],
    center: [120.80, 15.20],
    zoom: 9
  },
  "Cagayan Basin": {
    name: "Cagayan River Basin",
    coordinates: [
      [121.20, 17.60], [121.60, 17.50], [122.00, 17.30], [122.20, 17.00],
      [122.40, 16.60], [122.35, 16.20], [122.10, 15.90], [121.80, 15.70],
      [121.50, 15.80], [121.30, 16.00], [121.20, 16.30], [121.25, 16.70],
      [121.30, 17.10], [121.20, 17.60]
    ],
    center: [121.80, 16.70],
    zoom: 8
  },
  "Agno River": {
    name: "Agno River Basin",
    coordinates: [
      [119.90, 16.00], [120.20, 15.80], [120.50, 15.70], [120.80, 15.75],
      [120.95, 15.90], [120.90, 16.10], [120.70, 16.20], [120.45, 16.15],
      [120.20, 16.10], [119.90, 16.00]
    ],
    center: [120.45, 15.95],
    zoom: 9
  },
  "Bicol River": {
    name: "Bicol River Basin",
    coordinates: [
      [123.00, 13.20], [123.30, 13.15], [123.60, 13.20], [123.80, 13.40],
      [123.85, 13.65], [123.75, 13.85], [123.55, 13.90], [123.30, 13.85],
      [123.10, 13.70], [123.00, 13.50], [122.95, 13.30], [123.00, 13.20]
    ],
    center: [123.40, 13.55],
    zoom: 9
  }
};

export const getBasinGeoData = (basinName: string): BasinGeoJSON | null => {
  return basinGeoData[basinName] || null;
};
