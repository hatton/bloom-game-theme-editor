import { Theme } from "../types/theme-editor";

export const parseCssTheme = (css: string): Theme => {
  const result: Theme = {
    id: Date.now().toString(), // Generate a unique ID
    displayName: "", // Will be populated by the caller if needed
    slug: "", // Will be populated by the caller if needed
    isFactory: false,
    variables: {},
  };

  // Find theme class selector block
  const themeMatch = css.match(
    /\.bloom-page\.game-theme-([a-zA-Z0-9-_]+)\s*{([^}]*)}/
  );

  if (!themeMatch) {
    throw new Error("Invalid CSS format: No theme class found");
  }

  // Extract CSS variables from the block
  const cssBlock = themeMatch[2];
  const variableRegex = /--([a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g;

  let match;
  while ((match = variableRegex.exec(cssBlock)) !== null) {
    const name = `--${match[1]}`;
    const value = match[2].trim();
    result.variables[name] = value;
  }

  return result;
};
