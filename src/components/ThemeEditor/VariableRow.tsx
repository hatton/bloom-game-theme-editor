
import React from "react";
import { Button } from "../../components/ui/button";
import ColorPicker from "./ColorPicker";
import { CSSVariable } from "../../types/theme-editor";

interface VariableRowProps {
  variable: CSSVariable;
  value: string;
  isOverridden: boolean;
  onColorChange: (value: string) => void;
  onReset: () => void;
}

const VariableRow = ({
  variable,
  value,
  isOverridden,
  onColorChange,
  onReset,
}: VariableRowProps) => {
  // Calculate left margin based on hierarchy level
  const indentLevel = variable.level;
  const indentSize = 24; // pixels
  const marginLeft = `${indentLevel * indentSize}px`;

  // Show vertical connecting lines for hierarchy
  const showConnector = indentLevel > 0;

  return (
    <div
      className="flex items-center py-2 group relative"
      style={{ marginLeft }}
    >
      {/* Hierarchy connectors */}
      {showConnector && (
        <>
          {/* Vertical line to parent */}
          <div
            className="absolute bg-editor-hierarchy-line w-px"
            style={{
              top: 0,
              bottom: "50%",
              left: `-${indentSize / 2}px`,
            }}
          ></div>
          {/* Horizontal line to variable */}
          <div
            className="absolute bg-editor-hierarchy-line h-px"
            style={{
              left: `-${indentSize / 2}px`,
              width: `${indentSize / 2 - 4}px`,
              top: "50%",
            }}
          ></div>
        </>
      )}

      {/* Variable display name */}
      <div className="flex-1 text-sm font-medium">
        {variable.displayName}
      </div>

      {/* Color picker and status */}
      <div className="flex items-center gap-2">
        <ColorPicker
          color={value}
          onChange={onColorChange}
          isInherited={!isOverridden}
        />
        
        {!isOverridden ? (
          <span className="text-xs text-editor-inherited">Inherited</span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default VariableRow;
