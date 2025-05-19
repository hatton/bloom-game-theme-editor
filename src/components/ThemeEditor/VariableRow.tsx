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

      {/* Variable display name and controls */}
      <div className="flex items-center justify-between w-full gap-2">
        <div className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
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
            <>
              {variable.level > 1 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={onReset}
                >
                  Reset
                </Button>
              ) : variable.level === 0 ? (
                <div className="h-7 px-2 w-[63px]"></div> // Spacer with same dimensions as the button
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariableRow;
