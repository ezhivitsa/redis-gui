declare global {
  interface Window {
    theme: {
      shouldUseDarkColors?: boolean;
    };
  }
}

export default global;
