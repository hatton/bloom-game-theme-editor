
import React, { useMemo } from "react";
import "../../styles/themeRules.css";

interface ThemePreviewProps {
  resolvedValues: Record<string, string>;
  themeTitle?: string;
}

const ThemePreview = ({ resolvedValues, themeTitle }: ThemePreviewProps) => {
  // Create a style element with CSS variables
  const themeStyle = useMemo(() => {
    const styleElement = document.createElement('style');
    
    // Create CSS rule with all the variables
    let cssText = ':root {\n';
    Object.entries(resolvedValues).forEach(([key, value]) => {
      cssText += `  ${key}: ${value};\n`;
    });
    cssText += '}';
    
    styleElement.textContent = cssText;
    return styleElement;
  }, [resolvedValues]);

  // Apply the theme style to the document when the component mounts
  // and remove it when it unmounts
  React.useEffect(() => {
    document.head.appendChild(themeStyle);
    return () => {
      document.head.removeChild(themeStyle);
    };
  }, [themeStyle]);

  return (
    <div className="border rounded-md overflow-hidden">
      {themeTitle && (
        <div 
          className="p-3 text-center font-medium"
          style={{
            backgroundColor: resolvedValues["--game-header-bg-color"] || "#000000",
            color: resolvedValues["--game-header-color"] || "#ffffff"
          }}
        >
          {themeTitle}
        </div>
      )}
      <div 
        className="p-4"
        style={{
          backgroundColor: resolvedValues["--game-page-bg-color"] || "#ffffff",
          color: resolvedValues["--game-text-color"] || "#000000"
        }}
      >
        <p className="mb-3">This is sample text in the theme.</p>
        
        <div className="flex gap-2 mb-3">
          <button
            className="px-3 py-1 rounded text-sm"
            style={{
              backgroundColor: resolvedValues["--game-button-bg-color"] || "#ffffff",
              color: resolvedValues["--game-button-text-color"] || "#000000",
              border: `1px solid ${resolvedValues["--game-button-outline-color"] || "#000000"}`
            }}
          >
            Normal Button
          </button>
          
          <button
            className="px-3 py-1 rounded text-sm"
            style={{
              backgroundColor: resolvedValues["--game-button-correct-bg-color"] || "#000000",
              color: resolvedValues["--game-button-correct-color"] || "#ffffff"
            }}
          >
            Correct Button
          </button>
          
          <button
            className="px-3 py-1 rounded text-sm"
            style={{
              backgroundColor: resolvedValues["--game-button-wrong-bg-color"] || "#848484",
              color: resolvedValues["--game-button-wrong-color"] || "#ffffff"
            }}
          >
            Wrong Button
          </button>
        </div>

        <div 
          className="p-2 rounded mb-3"
          style={{
            backgroundColor: resolvedValues["--game-draggable-bg-color"] || "#000000",
            color: resolvedValues["--game-draggable-color"] || "#ffffff",
            border: `1px solid ${resolvedValues["--game-draggable-target-outline-color"] || "#000000"}`
          }}
        >
          Draggable Element
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded"
              style={{
                border: `2px solid ${resolvedValues["--game-checkbox-outline-color"] || "#000000"}`,
                backgroundColor: "transparent"
              }}
            ></div>
            <span style={{ color: resolvedValues["--game-checkbox-text-color"] || "#000000" }}>
              Normal Checkbox
            </span>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <div 
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{
                border: `2px solid ${resolvedValues["--game-selected-checkbox-outline-color"] || "#000000"}`,
                backgroundColor: resolvedValues["--game-selected-checkbox-bg-color"] || "#000000"
              }}
            >
              <div 
                className="w-3 h-3 text-xs flex items-center justify-center"
                style={{
                  color: resolvedValues["--game-selected-checkbox-color"] || "#ffffff"
                }}
              >
                ✓
              </div>
            </div>
            <span style={{ color: resolvedValues["--game-checkbox-text-color"] || "#000000" }}>
              Selected Checkbox
            </span>
          </div>
        </div>

        <div 
          className="text-xs text-right mt-4"
          style={{
            color: resolvedValues["--game-page-number-color"] || "#000000"
          }}
        >
          Page 1
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
