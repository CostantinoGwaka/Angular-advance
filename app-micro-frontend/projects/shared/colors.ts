export const colors = {
  primary: {
    main: '#1394db',
    transparent: '#1394db60',
    dark: '#0777b4',
    light: '#d0eaf8',
  },

  accent: {
    main: '#21a43f',
    transparent: '#21a43f60',
    dark: '#038c3a',
    light: '#88f7b5',
  },
  warn: {
    main: '#ff0000',
    transparent: '#ff000060',
    dark: '#8a0303',
    light: '#ffbbbb',
  },
  secondary: {
    main: '#fbd306',
    transparent: '#fbd30660',
    dark: '#c8a705',
    light: '#fff0a7',
  },
  tertiary: {
    main: '#08210d',
    transparent: '#08210d60',
    dark: '#030f05',
    light: '#7f9283',
  },
  gray: {
    main: '#8798ad',
    transparent: '#8798ad60',
    dark: '#41546b',
    light: '#c4d1e1',
    light2: '#e0eaf5',
  },
};

export function getColor(colorString: string): string {
  type ObjectKey = keyof typeof colors;

  const colorVar = colorString as ObjectKey;

  if (colors[colorVar]) {
    return colors[colorVar].main;
  } else {
    return colorString;
  }
}
