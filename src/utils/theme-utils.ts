
import { CSSVariable, Theme, HierarchyNode } from "../types/theme-editor";
import "../styles/themeRules.css";

// Default values for CSS variables
export const defaultValues = {
  "--game-primary-color": "black",
  "--game-secondary-color": "white",
  "--game-button-wrong-color": "white",
  "--game-button-wrong-bg-color": "#848484",
};

// Helper to get slugified string from display name
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

// CSS variable definitions with hierarchy information
export const cssVariables: CSSVariable[] = [
  { name: "--game-primary-color", displayName: "Primary", level: 0 },
  {
    name: "--game-primary-bg-color",
    displayName: "Primary Background",
    level: 1,
    parent: "--game-primary-color",
  },
  {
    name: "--game-button-correct-bg-color",
    displayName: "Button Correct Background",
    level: 2,
    parent: "--game-primary-bg-color",
  },
  {
    name: "--game-selected-checkbox-bg-color",
    displayName: "Selected Checkbox Background",
    level: 3,
    parent: "--game-button-correct-bg-color",
  },
  {
    name: "--game-selected-checkbox-outline-color",
    displayName: "Selected Checkbox Outline",
    level: 4,
    parent: "--game-selected-checkbox-bg-color",
  },
  {
    name: "--game-draggable-bg-color",
    displayName: "Draggable Background",
    level: 2,
    parent: "--game-primary-bg-color",
  },
  {
    name: "--game-draggable-target-outline-color",
    displayName: "Draggable Target Outline",
    level: 3,
    parent: "--game-draggable-bg-color",
  },
  {
    name: "--game-header-bg-color",
    displayName: "Header Background",
    level: 2,
    parent: "--game-primary-bg-color",
  },
  {
    name: "--game-control-button-bg-color",
    displayName: "Control Button Background",
    level: 2,
    parent: "--game-primary-bg-color",
  },
  {
    name: "--game-text-color",
    displayName: "Text",
    level: 1,
    parent: "--game-primary-color",
  },
  {
    name: "--game-page-number-color",
    displayName: "Page Number",
    level: 2,
    parent: "--game-text-color",
  },
  {
    name: "--game-checkbox-text-color",
    displayName: "Checkbox Text",
    level: 2,
    parent: "--game-text-color",
  },
  {
    name: "--game-checkbox-outline-color",
    displayName: "Checkbox Outline",
    level: 3,
    parent: "--game-checkbox-text-color",
  },
  {
    name: "--game-button-text-color",
    displayName: "Button Text",
    level: 1,
    parent: "--game-primary-color",
  },
  {
    name: "--game-button-outline-color",
    displayName: "Button Outline",
    level: 2,
    parent: "--game-button-text-color",
  },
  { name: "--game-secondary-color", displayName: "Secondary", level: 0 },
  {
    name: "--game-page-bg-color",
    displayName: "Page Background",
    level: 1,
    parent: "--game-secondary-color",
  },
  {
    name: "--page-background-color",
    displayName: "Appearance System Page Background",
    level: 2,
    parent: "--game-page-bg-color",
  },
  {
    name: "--game-button-bg-color",
    displayName: "Button Background",
    level: 1,
    parent: "--game-secondary-color",
  },
  {
    name: "--game-button-correct-color",
    displayName: "Button Correct Text/Icon",
    level: 1,
    parent: "--game-secondary-color",
  },
  {
    name: "--game-selected-checkbox-color",
    displayName: "Selected Checkbox Icon",
    level: 2,
    parent: "--game-button-correct-color",
  },
  {
    name: "--game-draggable-color",
    displayName: "Draggable Text/Icon",
    level: 1,
    parent: "--game-secondary-color",
  },
  {
    name: "--game-header-color",
    displayName: "Header Text",
    level: 1,
    parent: "--game-secondary-color",
  },
  {
    name: "--game-control-button-color",
    displayName: "Control Button Icon",
    level: 1,
    parent: "--game-secondary-color",
  },
  {
    name: "--game-button-wrong-color",
    displayName: "Button Wrong Text/Icon",
    level: 0,
  },
  {
    name: "--game-button-wrong-bg-color",
    displayName: "Button Wrong Background",
    level: 0,
  },
];

// Factory themes
export const factoryThemes: Theme[] = [
  {
    id: "1",
    displayName: "Blue on White",
    slug: "blue-on-white",
    isFactory: true,
    variables: {
      "--game-primary-color": "#539eff",
      "--game-secondary-color": "white",
    },
  },
  {
    id: "2",
    displayName: "Red on White",
    slug: "red-on-white",
    isFactory: true,
    variables: {
      "--game-primary-color": "#ff5353",
      "--game-secondary-color": "white",
    },
  },
  {
    id: "3",
    displayName: "White and Orange on Blue",
    slug: "white-and-orange-on-blue",
    isFactory: true,
    variables: {
      "--game-primary-color": "#ffb453",
      "--game-secondary-color": "#539eff",
      "--game-text-color": "white",
      "--game-draggable-color": "white",
      "--game-header-color": "var(--game-text-color)",
      "--game-header-bg-color": "var(--game-secondary-color)",
      "--game-button-text-color": "black",
      "--game-button-bg-color": "white",
      "--game-button-correct-color": "var(--game-text-color)",
      "--game-button-outline-color": "var(--game-page-bg-color)",
      "--game-checkbox-outline-color": "#848484",
    },
  },
];

// Get derivation map (what variable to use as default for each variable)
export const getDerivationMap = (): Record<string, string> => {
  const derivationMap: Record<string, string> = {};
  
  // Get all CSS rules that might define variable relationships
  const styleSheet = document.styleSheets[0]; // Assuming themeRules.css is loaded
  
  try {
    // First populate from cssVariables parent relationships
    cssVariables.forEach(variable => {
      if (variable.parent) {
        derivationMap[variable.name] = variable.parent;
      }
    });
    
    // Then try to enhance with actual CSS rules if possible
    if (styleSheet) {
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
          const cssText = rule.style.cssText;
          const varRegex = /--([a-z-]+):\s*var\(--([a-z-]+)\)/g;
          let match;
          
          while ((match = varRegex.exec(cssText)) !== null) {
            const targetVar = `--${match[1]}`;
            const sourceVar = `--${match[2]}`;
            derivationMap[targetVar] = sourceVar;
          }
        }
      }
    }
  } catch (e) {
    console.warn("Could not access stylesheet rules, using default derivation map", e);
  }

  return derivationMap;
};

// Build the hierarchy tree from flat list of variables
export const buildHierarchyTree = (): HierarchyNode[] => {
  const nodeMap: Record<string, HierarchyNode> = {};
  const roots: HierarchyNode[] = [];

  // Initialize nodes
  cssVariables.forEach(variable => {
    nodeMap[variable.name] = {
      ...variable,
      children: []
    };
  });

  // Build tree
  cssVariables.forEach(variable => {
    if (variable.parent) {
      const parentNode = nodeMap[variable.parent];
      if (parentNode) {
        parentNode.children.push(nodeMap[variable.name]);
      }
    } else {
      roots.push(nodeMap[variable.name]);
    }
  });

  return roots;
};

// Generate CSS from theme
export const generateThemeCSS = (theme: Theme): string => {
  if (!theme) return '';

  const cssLines = [`.bloom-page.game-theme-${theme.slug} {`];
  
  // Sort variables to ensure consistent output
  const sortedVarNames = Object.keys(theme.variables).sort();
  
  // Add each variable
  sortedVarNames.forEach(varName => {
    cssLines.push(`  ${varName}: ${theme.variables[varName]};`);
  });
  
  cssLines.push('}');
  
  return cssLines.join('\n');
};

// Resolve variable value (taking into account inheritance)
export const resolveVariableValue = (
  variableName: string,
  theme: Theme,
  derivationMap: Record<string, string>,
  resolvedValues: Record<string, string> = {}
): string => {
  // If we've already resolved this variable, return the cached result
  if (resolvedValues[variableName]) {
    return resolvedValues[variableName];
  }
  
  // If this variable is explicitly set in the theme, use that value
  if (theme.variables[variableName]) {
    const value = theme.variables[variableName];
    
    // If the value references another variable, resolve that variable first
    if (value.includes('var(')) {
      const referencedVarMatch = value.match(/var\((--[a-z-]+)\)/);
      if (referencedVarMatch && referencedVarMatch[1]) {
        const referencedVar = referencedVarMatch[1];
        const resolvedRefValue = resolveVariableValue(
          referencedVar,
          theme,
          derivationMap,
          resolvedValues
        );
        
        // Cache and return the resolved value
        resolvedValues[variableName] = resolvedRefValue;
        return resolvedRefValue;
      }
    }
    
    // Cache and return the direct value
    resolvedValues[variableName] = value;
    return value;
  }
  
  // If this is a root variable with no explicit value, use the default
  if (defaultValues[variableName]) {
    resolvedValues[variableName] = defaultValues[variableName];
    return defaultValues[variableName];
  }
  
  // Otherwise, check if this variable derives from another
  if (derivationMap[variableName]) {
    const parentVar = derivationMap[variableName];
    const parentValue = resolveVariableValue(
      parentVar,
      theme,
      derivationMap,
      resolvedValues
    );
    
    // Cache and return the inherited value
    resolvedValues[variableName] = parentValue;
    return parentValue;
  }
  
  // If we can't resolve the value, default to black
  return '#000000';
};

// Convert CSS variable reference to resolved color
export const parseAndResolveVarReference = (
  value: string,
  theme: Theme,
  derivationMap: Record<string, string>,
  resolvedValues: Record<string, string>
): string => {
  if (!value.includes('var(')) {
    return value;
  }

  const varMatch = value.match(/var\((--[a-z-]+)\)/);
  if (varMatch && varMatch[1]) {
    return resolveVariableValue(varMatch[1], theme, derivationMap, resolvedValues);
  }

  return value;
};

// Create a new unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
};
