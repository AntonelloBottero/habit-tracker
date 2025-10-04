'use client';

import React, { useState, ReactNode, ChangeEvent } from 'react';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';
import { FakeInputChangeEvent } from '@/app/types'

interface Props {
  reference: ReactNode
  children: ReactNode
  onChange?: (e: FakeInputChangeEvent) => void
}

const FloatingMenu = ({ reference, children, onChange = undefined }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleMenu = (value: boolean) => {
    setIsOpen(value)
    if(onChange) {
      onChange({ target: { value } })
    }
  }

  const { refs, floatingStyles, placement } = useFloating({
    open: isOpen,
    onOpenChange: toggleMenu,
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
        onClick={() => toggleMenu(!isOpen)}
      >
        {reference}
      </div>

      {/* Floating element */}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles} // Calculated coordinates
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