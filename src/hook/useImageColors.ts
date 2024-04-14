import Color from 'color';
import {ImageColorsResult, getColors} from 'react-native-image-colors';
import {MD3LightTheme} from 'react-native-paper';

export const useImageColors = async (url: string) => {
  let colors: string[] = [];

  const imgColors: ImageColorsResult = await getColors(url, {
    fallback: Color(MD3LightTheme.colors.primary).hex(),
    cache: true,
    key: url,
  });

  for (const key in imgColors) {
    if (key !== 'platform') {
      const color = Color(imgColors[key as keyof ImageColorsResult]);
      colors.push(color.hsv().toString());
    }
  }

  return colors;
};
