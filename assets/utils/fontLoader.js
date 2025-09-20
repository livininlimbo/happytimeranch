// Font loading utility for web
export const loadFonts = async () => {
  if (typeof window === 'undefined') return;

  const fonts = [
    {
      family: 'Ionicons',
      source: './assets/fonts/Ionicons.ttf',
      fallback: 'https://cdn.jsdelivr.net/npm/ionicons@6.0.0/dist/fonts/ionicons.ttf'
    },
    {
      family: 'Alegreya-VariableFont_wght',
      source: './assets/fonts/Alegreya-VariableFont_wght.ttf'
    }
  ];

  const fontPromises = fonts.map(async (font) => {
    try {
      const fontFace = new FontFace(font.family, `url(${font.source})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      return fontFace;
    } catch (error) {
      console.warn(`Failed to load font ${font.family} from ${font.source}`, error);
      
      // Try fallback if available
      if (font.fallback) {
        try {
          const fallbackFontFace = new FontFace(font.family, `url(${font.fallback})`);
          await fallbackFontFace.load();
          document.fonts.add(fallbackFontFace);
          return fallbackFontFace;
        } catch (fallbackError) {
          console.error(`Failed to load fallback font ${font.family}`, fallbackError);
        }
      }
      return null;
    }
  });

  try {
    await Promise.all(fontPromises);
    console.log('All fonts loaded successfully');
  } catch (error) {
    console.error('Some fonts failed to load:', error);
  }
};

// Auto-load fonts when module is imported
if (typeof window !== 'undefined') {
  loadFonts();
}