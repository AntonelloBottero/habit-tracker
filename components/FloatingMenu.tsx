'use client';

import React, { useState } from 'react';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';

const FloatingMenu = ({ reference, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  
  const { refs, floatingStyles, placement } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start', // initial position
    middleware: [ // manages advanced rules of position
      offset(8), // gap between activator and menu
      flip(),    // if not enough space to cover initial position, menu is flipped in the opposite position
      shift()    // shifts menu if viewport space is not enough
    ],
    whileElementsMounted: autoUpdate, // Updates position during scroll/resize
  });

  return (
    <>
      {/* Activator */}
      <div 
        ref={refs.setReference} 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer inline-block" // Importante per l'allineamento
      >
        {reference}
      </div>

      {/* Floating element */}
      {isOpen && (
        <div 
          ref={refs.setFloating} 
          style={floatingStyles} // Applica le coordinate calcolate
          className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50 absolute" // Classi Tailwind per l'aspetto
        >
          {children}
          <div className="text-xs text-gray-500 mt-2">
             Posizionato: {placement} 
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingMenu;