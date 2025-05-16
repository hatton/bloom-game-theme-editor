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
  const themePartsMatch = css.match(
    /\.bloom-page\.game-theme-([a-zA-Z0-9-_]+)\s*{([^}]*)}/
  );

  if (!themePartsMatch) {
    throw new Error(
      "Could not make sense of the CSS. It should be of the form: .bloom-page.game-theme-<theme-name> { ... }"
    );
  }
  result.slug = themePartsMatch[1];
  result.displayName = result.slug.replace(/-/g, " ");

  // Extract CSS variables from the block
  const rulesBlock = themePartsMatch[2];
  const variableRegex = /--([a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g;

  let match;
  while ((match = variableRegex.exec(rulesBlock)) !== null) {
    const name = `--${match[1]}`;
    const value = match[2].trim();
    result.variables[name] = value;
  }

  return result;
};
