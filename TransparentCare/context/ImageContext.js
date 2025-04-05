import React, { createContext, useState, useContext } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [base64Image, setBase64Image] = useState(null);

  return (
    <ImageContext.Provider value={{ base64Image, setBase64Image }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => useContext(ImageContext);