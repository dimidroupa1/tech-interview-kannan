type Size = {
  xxs: string;
  xs: string;
  sm: string;
  mdS: string;
  md: string;
  mdL: string;
  lg: string;
  xl: string;
  xxl: string;
};

export const size: Size = {
  xxs: "375px", // for small screen mobile
  xs: "425px", // typical iphone screen size
  sm: "500px", // for mobile screen / small tablets
  mdS: "768px", // for medium tablets
  md: "900px", // for larger tablets
  mdL: "992px", // for larger tablets/small laptops
  lg: "1280px", // for laptops
  xl: "1440px", // for desktop / monitors
  xxl: "1728px", // for big screens
};

export const device = {
  xxs: `(max-width: ${size.xxs})`,
  xs: `(max-width: ${size.xs})`,
  sm: `(max-width : ${size.sm})`,
  mdS: `(max-width: ${size.mdS})`,
  md: `(max-width: ${size.md})`,
  mdL: `(max-width: ${size.mdL})`,
  lg: `(max-width: ${size.lg})`,
  xl: `(max-width: ${size.xl})`,
  xxl: `(max-width: ${size.xxl})`,
};
