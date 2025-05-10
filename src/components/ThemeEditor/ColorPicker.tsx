
import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  isInherited?: boolean;
  size?: "sm" | "md" | "lg";
}

const ColorPicker = ({
  color,
  onChange,
  isInherited = false,
  size = "md",
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "rounded relative cursor-pointer border border-gray-300 shadow-sm transition-all",
          sizeClasses[size],
          isInherited && "opacity-80"
        )}
        style={{ backgroundColor: color }}
        onClick={handleColorClick}
      >
        {isInherited && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-200 h-px w-full rotate-45 opacity-60"></div>
          </div>
        )}
      </div>
      <input
        ref={colorInputRef}
        type="color"
        className="sr-only"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ColorPicker;
