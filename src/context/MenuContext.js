"use client";

import { createContext, useContext, useState } from "react";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBusinessPopupOpen, setIsBusinessPopupOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const openBusinessPopup = (businessData) => {
    setSelectedBusiness(businessData);
    setIsBusinessPopupOpen(true);
  };

  const closeBusinessPopup = () => {
    setIsBusinessPopupOpen(false);
  };

  return (
    <MenuContext.Provider value={{ 
      isMenuOpen, 
      setIsMenuOpen,
      toggleMenu, 
      isBusinessPopupOpen,
      selectedBusiness,
      openBusinessPopup,
      closeBusinessPopup
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
