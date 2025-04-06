type aspectRatioTypes = ["landscape", "square", "portrait"];

export type AspectRatio = aspectRatioTypes[number];

export const baseAspectRatio: Record<AspectRatio, number> = {
  landscape: 16 / 9,
  square: 1,
  portrait: 9 / 16,
};
