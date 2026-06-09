"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBusinessPopupOpen, setIsBusinessPopupOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      setIsMenuOpen(false);
      setIsBusinessPopupOpen(false);
    }
  }, [pathname]);

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
