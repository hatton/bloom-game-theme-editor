export interface CSSVariable {
  name: string;
  displayName: string;
  level: number;
  parent?: string;
}

export interface ThemeVariable {
  name: string;
  value: string;
}

export interface Theme {
  id: string;
  displayName: string;
  slug: string;
  isFactory: boolean;
  variables: Record<string, string>;
}

export interface HierarchyNode extends CSSVariable {
  children: HierarchyNode[];
}

export interface GeneratedTheme extends Theme {
  sourceImageUrl?: string;
}
