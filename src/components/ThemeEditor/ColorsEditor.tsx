import React, { useState, useEffect, useCallback } from "react";
import { ScrollArea } from "../ui/scroll-area";
import VariableRow from "./VariableRow";
import { CSSVariable, Theme, HierarchyNode } from "../../types/theme-editor";
import { buildHierarchyTree } from "../../utils/theme-utils";

interface ColorsEditorProps {
  cssVariables: CSSVariable[]; // Keep this for now, might be replaced by hierarchy
  resolvedValues: Record<string, string>;
  isVariableOverridden: (variableName: string) => boolean;
  onColorChange: (variableName: string, value: string) => void;
  onResetVariable: (variableName: string) => void;
  selectedTheme: Theme; // Added to help determine initial expansion
}

const ColorsEditor = ({
  resolvedValues,
  isVariableOverridden,
  onColorChange,
  onResetVariable,
  selectedTheme,
}: ColorsEditorProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );
  const [hierarchy, setHierarchy] = useState<HierarchyNode[]>([]);

  useEffect(() => {
    setHierarchy(buildHierarchyTree());
  }, []);

  const isNodeCustomized = useCallback(
    (node: HierarchyNode, theme: Theme): boolean => {
      if (Object.keys(theme.variables).includes(node.name)) {
        return true;
      }
      if (node.children && node.children.length > 0) {
        return node.children.some((child) => isNodeCustomized(child, theme));
      }
      return false;
    },
    []
  );

  useEffect(() => {
    if (hierarchy.length > 0 && selectedTheme) {
      const initialExpansionState: Record<string, boolean> = {};
      const setInitialExpansion = (nodes: HierarchyNode[]) => {
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            const shouldExpand = node.children.some((child) =>
              isNodeCustomized(child, selectedTheme)
            );
            initialExpansionState[node.name] = shouldExpand;
            setInitialExpansion(node.children); // Recurse for nested children
          }
        });
      };
      setInitialExpansion(hierarchy);
      setExpandedNodes(initialExpansionState);
    }
  }, [hierarchy, selectedTheme, isNodeCustomized]);

  const toggleNode = (nodeName: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeName]: !prev[nodeName] }));
  };

  const renderTree = (nodes: HierarchyNode[], level = 0) => {
    return nodes.map((node) => (
      <React.Fragment key={node.name}>
        <VariableRow
          variable={node}
          value={resolvedValues[node.name] || "#000000"}
          isOverridden={isVariableOverridden(node.name)}
          onColorChange={(value) => onColorChange(node.name, value)}
          onReset={() => onResetVariable(node.name)}
          isExpanded={expandedNodes[node.name]}
          onToggleExpand={
            node.children && node.children.length > 0
              ? () => toggleNode(node.name)
              : undefined
          }
          hasChildren={node.children && node.children.length > 0}
          level={level} // Pass level for indentation
        />
        {node.children &&
          node.children.length > 0 &&
          expandedNodes[node.name] &&
          renderTree(node.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="border rounded-md">
      <div className="bg-muted p-3 border-b">
        <h3 className="text-sm font-medium">Colors</h3>
      </div>
      <ScrollArea className="h-[calc(100vh_-_200px)]">
        <div className="p-4">{renderTree(hierarchy)}</div>
      </ScrollArea>
    </div>
  );
};

export default ColorsEditor;
