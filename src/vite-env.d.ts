/// <reference types="vite/client" />

interface Window {
  FB: {
    XFBML: {
      parse: () => void;
    };
  };
}