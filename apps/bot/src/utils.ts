const paintingTypes = [
  "Portrait",
  "Landscape",
  "Still Life",
  "Abstract",
  "Historical",
  "Genre",
  "Religious",
  "Abstract Expressionism",
  "Surrealism",
  "Impressionism",
  "Cubism",
  "Pop Art",
  "Minimalism",
  "Pointillism",
  "Fauvism",
  "Realism",
  "Symbolism",
];

const painters = [
  "Leonardo da Vinci",
  "Rembrandt",
  "Eugène Delacroix",
  "Claude Monet",
  "Vincent van Gogh",
  "Georges Seurat",
  "Pablo Picasso",
  "Salvador Dalí",
  "Jackson Pollock",
  "Andy Warhol",
  "Henri Matisse",
  "Gustave Courbet",
  "Wassily Kandinsky",
  "Jacques-Louis David",
  "Jean-Honoré Fragonard",
  "Zdzisław Beksiński",
];

export const getRandomDefaultMessage = (username: string) => {
  const paintingType =
    paintingTypes[Math.floor(Math.random() * paintingTypes.length)];

  const painter = painters[Math.floor(Math.random() * painters.length)];

  return `${paintingType} painting of ${username}, in the style of ${painter}`;
};
