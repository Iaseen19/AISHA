export const theme = {
  colors: {
    primary: '#4A90E2',
    healing: '#50B2A1',
    lavender: '#9B8EB5',
    sand: '#F5E6D3',
    error: '#E66C7E',
    warning: '#FFD666',
    success: '#66BB6A',
    darkGray: '#2D3436',
    mediumGray: '#636E72',
    lightGray: '#B2BEC3',
    offWhite: '#F7F9FC',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  typography: {
    display: {
      size: '40px',
      lineHeight: '48px',
    },
    h1: {
      size: '32px',
      lineHeight: '40px',
    },
    h2: {
      size: '24px',
      lineHeight: '32px',
    },
    h3: {
      size: '20px',
      lineHeight: '28px',
    },
    bodyLarge: {
      size: '18px',
      lineHeight: '28px',
    },
    body: {
      size: '16px',
      lineHeight: '24px',
    },
    small: {
      size: '14px',
      lineHeight: '20px',
    },
    caption: {
      size: '12px',
      lineHeight: '16px',
    },
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  },
  containers: {
    maxWidth: '1200px',
  },
  components: {
    button: {
      height: '48px',
      compactHeight: '40px',
      padding: '16px 24px',
      borderRadius: '8px',
    },
    input: {
      height: '48px',
      borderRadius: '8px',
      padding: '12px 16px',
    },
    card: {
      borderRadius: '12px',
      shadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '24px',
    },
  },
} as const; 