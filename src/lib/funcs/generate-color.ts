import type { Color } from "../types/color";

export function generateColor(color: Color) {
  switch (color) {
    case "red":
      return "stroke-red-400 fill-red-400";
    case "green":
      return "stroke-green-400 fill-green-400";
    case "blue":
      return "stroke-blue-400 fill-blue-400";
    case "yellow":
      return "stroke-yellow-400 fill-yellow-400";
    case "purple":
      return "stroke-purple-400 fill-purple-400";
    case "orange":
      return "stroke-orange-400 fill-orange-400";
    case "pink":
      return "stroke-pink-400 fill-pink-400";
    case "black":
      return "stroke-black fill-black";
    case "white":
      return "stroke-black";
    default:
      return "stroke-black";
  }
}

export function getComputedColorValue(color: Color): string {
  switch (color) {
    case "red":
      return "#f87171";
    case "green":
      return "#4ade80";
    case "blue":
      return "#60a5fa";
    case "yellow":
      return "#facc15";
    case "purple":
      return "#c084fc";
    case "orange":
      return "#fb923c";
    case "pink":
      return "#f472b6";
    case "black":
      return "#000000";
    case "white":
      return "#f5f5f5";
    default:
      return "#e5e7eb";
  }
}
