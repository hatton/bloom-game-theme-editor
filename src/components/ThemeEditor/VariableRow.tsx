import React from "react";
import { Button } from "../../components/ui/button";
import ColorPicker from "./ColorPicker";
import { CSSVariable, HierarchyNode } from "../../types/theme-editor"; // Updated to HierarchyNode
import { ChevronDown, ChevronRight } from "lucide-react";

interface VariableRowProps {
  variable: HierarchyNode; // Updated to HierarchyNode
  value: string;
  isOverridden: boolean;
  onColorChange: (value: string) => void;
  onReset: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  hasChildren?: boolean;
  level: number; // Added level prop
}

const VariableRow = ({
  variable,
  value,
  isOverridden,
  onColorChange,
  onReset,
  isExpanded,
  onToggleExpand,
  hasChildren,
  level, // Use passed level
}: VariableRowProps) => {
  const indentSize = 24; // pixels
  const marginLeft = `${level * indentSize}px`; // Use passed level for margin

  const showConnector = level > 0;

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
        <div className="flex items-center gap-1">
          {hasChildren && onToggleExpand && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleExpand}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!hasChildren && (
            <div className="w-6 h-6"></div> // Spacer for alignment
          )}
          <div className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
            {variable.displayName}
          </div>
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
              {variable.level > 0 ? ( // Allow reset for all non-root overridden variables
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={onReset}
                >
                  Reset
                </Button>
              ) : (
                <div className="h-7 px-2 w-[63px]"></div> // Spacer for root variables
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariableRow;
