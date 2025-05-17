import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import VariableRow from "./VariableRow";
import CssView from "./CssView";
import ThemePreview from "./ThemePreview";
import ContrastChecker from "./ContrastChecker";
import {
  cssVariables,
  factoryThemes,
  generateThemeCSS,
  resolveVariableValue,
  slugify,
  getDerivationMap,
  generateId,
} from "../../utils/theme-utils";
import { Theme } from "../../types/theme-editor";
import { parseCssTheme } from "../../utils/css-parser";

interface ThemeEditorProps {
  initialThemes?: Theme[];
  onThemeChange?: (themes: Theme[]) => void;
}

// Create a default custom theme
const defaultCustomTheme: Theme = {
  id: generateId(),
  displayName: "Custom",
  slug: "custom",
  isFactory: false,
  variables: {
    "--game-primary-color": "#6a56c2", // Purple primary
    "--game-secondary-color": "#ffffff", // White secondary
    "--game-button-correct-bg-color": "#833a79",
  },
};

const ThemeEditor = ({
  initialThemes = [],
  onThemeChange,
}: ThemeEditorProps) => {
  // State
  const [themes, setThemes] = useState<Theme[]>([
    defaultCustomTheme,
    ...factoryThemes,
    ...initialThemes,
  ]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(
    defaultCustomTheme.id
  ); // Default to custom theme
  const [newThemeName, setNewThemeName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [cssOutput, setCssOutput] = useState("");
  const [activeTab, setActiveTab] = useState("editor");

  const selectedTheme = useMemo(
    () => themes.find((theme) => theme.id === selectedThemeId) || themes[0],
    [themes, selectedThemeId]
  );

  const derivationMap = useMemo(() => getDerivationMap(), []);

  // Update CSS output when the selected theme changes
  useEffect(() => {
    if (selectedTheme) {
      const css = generateThemeCSS(selectedTheme);
      setCssOutput(css);
    }
  }, [selectedTheme]);

  // Notify parent component of theme changes
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(themes);
    }
  }, [themes, onThemeChange]);

  // Calculate resolved values for all variables in the current theme
  const resolvedValues = useMemo(() => {
    if (!selectedTheme) return {};

    const resolvedValues: Record<string, string> = {};
    cssVariables.forEach((variable) => {
      resolvedValues[variable.name] = resolveVariableValue(
        variable.name,
        selectedTheme,
        derivationMap,
        { ...resolvedValues }
      );
    });

    return resolvedValues;
  }, [selectedTheme, derivationMap]);

  // Check if a variable is explicitly overridden in the current theme
  const isVariableOverridden = (variableName: string): boolean => {
    if (!selectedTheme) return false;
    return Object.keys(selectedTheme.variables).includes(variableName);
  };

  // Handlers
  const handleThemeSelect = (themeId: string) => {
    setSelectedThemeId(themeId);
  };

  const handleCreateTheme = () => {
    if (!newThemeName.trim()) {
      toast.error("Theme name cannot be empty");
      return;
    }

    const slug = slugify(newThemeName);
    const id = generateId();

    const newTheme: Theme = {
      id,
      displayName: newThemeName,
      slug,
      isFactory: false,
      variables: {
        "--game-primary-color": "#9b87f5", // Default to a nice blue
        "--game-secondary-color": "#ffffff",
      },
    };

    setThemes([...themes, newTheme]);
    setSelectedThemeId(id);
    setNewThemeName("");
    setIsCreateDialogOpen(false);
    toast.success(`Created theme: ${newThemeName}`);
  };

  const handleDuplicateTheme = () => {
    if (!selectedTheme) return;

    const newName = `${selectedTheme.displayName} Copy`;
    const slug = slugify(newName);
    const id = generateId();

    const newTheme: Theme = {
      id,
      displayName: newName,
      slug,
      isFactory: false,
      variables: { ...selectedTheme.variables },
    };

    setThemes([...themes, newTheme]);
    setSelectedThemeId(id);
    toast.success(`Duplicated theme: ${selectedTheme.displayName}`);
  };

  const handleRenameTheme = () => {
    if (!selectedTheme || selectedTheme.isFactory || !newThemeName.trim()) {
      return;
    }

    const updatedThemes = themes.map((theme) =>
      theme.id === selectedTheme.id
        ? {
            ...theme,
            displayName: newThemeName,
            slug: slugify(newThemeName),
          }
        : theme
    );

    setThemes(updatedThemes);
    setNewThemeName("");
    setIsRenameDialogOpen(false);
    toast.success(`Renamed theme to: ${newThemeName}`);
  };

  const handleColorChange = (variableName: string, value: string) => {
    if (!selectedTheme) return;

    // Don't allow changes to factory themes
    if (selectedTheme.isFactory) {
      toast.error(
        "Factory themes cannot be modified. Duplicate the theme to edit it."
      );
      return;
    }

    const updatedTheme: Theme = {
      ...selectedTheme,
      variables: {
        ...selectedTheme.variables,
        [variableName]: value,
      },
    };

    const updatedThemes = themes.map((theme) =>
      theme.id === selectedTheme.id ? updatedTheme : theme
    );

    setThemes(updatedThemes);
  };

  const handleResetVariable = (variableName: string) => {
    if (!selectedTheme) return;

    // Create a copy of the variables without the reset one
    const { [variableName]: _, ...remainingVariables } =
      selectedTheme.variables;

    const updatedTheme: Theme = {
      ...selectedTheme,
      variables: remainingVariables,
    };

    const updatedThemes = themes.map((theme) =>
      theme.id === selectedTheme.id ? updatedTheme : theme
    );

    setThemes(updatedThemes);
  };

  // Handle CSS paste
  const handleCssPaste = (css: string) => {
    if (!selectedTheme) return;

    // Don't allow changes to factory themes
    if (selectedTheme.isFactory) {
      toast.error(
        "Factory themes cannot be modified. Duplicate the theme to edit it."
      );
      return;
    }

    try {
      // Parse CSS to extract variables
      const parsedTheme = parseCssTheme(css);

      // If the theme has no variables, show an error
      if (Object.keys(parsedTheme.variables).length === 0) {
        toast.error("No valid CSS variables found in pasted content");
        return;
      }

      // Update the theme with parsed variables
      const updatedTheme: Theme = {
        ...selectedTheme,
        ...parsedTheme,
      };

      const updatedThemes = themes.map((theme) =>
        theme.id === selectedTheme.id ? updatedTheme : theme
      );

      setThemes(updatedThemes);
      // make sure this new theme is selected
      setSelectedThemeId(updatedTheme.id);
      toast.success(
        `Updated theme with ${Object.keys(parsedTheme.variables).length} variables`
      );
    } catch (error) {
      toast.error("Failed to parse CSS. Make sure the format is correct.");
      console.error("CSS parsing error:", error);
    }
  };

  // Use Preset Theme
  const handleUsePresetTheme = (presetTheme: Theme) => {
    // Check if a theme with similar ID already exists
    const existingTheme = themes.find((theme) => theme.id === presetTheme.id);

    if (existingTheme) {
      // Update the existing theme
      const updatedThemes = themes.map((theme) =>
        theme.id === presetTheme.id
          ? { ...presetTheme, isFactory: false }
          : theme
      );
      setThemes(updatedThemes);
      setSelectedThemeId(presetTheme.id);
    } else {
      // Add as a new theme
      setThemes([...themes, { ...presetTheme, isFactory: false }]);
      setSelectedThemeId(presetTheme.id);
    }
  };

  // We render nothing if there's no selected theme
  if (!selectedTheme) {
    return <div>Loading theme editor...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Low Budget Bloom Games Theme Editor</CardTitle>
            </div>
            <div className="flex gap-2">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                {/* <DialogTrigger asChild>
                  <Button variant="outline">New Theme</Button>
                </DialogTrigger> */}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Theme</DialogTitle>
                    <DialogDescription>
                      Enter a name for your new color theme
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="theme-name">Theme Name</Label>
                    <Input
                      id="theme-name"
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      placeholder="e.g., Dark Blue"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Theme slug: {newThemeName ? slugify(newThemeName) : "..."}
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTheme}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Row 1: Theme Selector and Actions */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="flex-1 min-w-0 sm:max-w-xs md:max-w-sm">
              <Select value={selectedThemeId} onValueChange={handleThemeSelect}>
                <SelectTrigger id="theme-select" className="w-full mt-1">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {/* Factory themes first */}
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Factory Themes
                  </div>
                  {themes
                    .filter((theme) => theme.isFactory)
                    .map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.displayName}
                      </SelectItem>
                    ))}
                  <Separator className="my-1" />
                  {/* Custom themes */}
                  {themes.filter((theme) => !theme.isFactory).length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Custom Themes
                      </div>
                      {themes
                        .filter((theme) => !theme.isFactory)
                        .map((theme) => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.displayName}
                          </SelectItem>
                        ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Theme actions */}
            <div className="flex gap-2 self-start sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDuplicateTheme}
              >
                Duplicate
              </Button>

              {!selectedTheme.isFactory && (
                <>
                  <Dialog
                    open={isRenameDialogOpen}
                    onOpenChange={setIsRenameDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Rename
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rename Theme</DialogTitle>
                        <DialogDescription>
                          Enter a new name for {selectedTheme.displayName}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="new-theme-name">New Name</Label>
                        <Input
                          id="new-theme-name"
                          value={newThemeName}
                          onChange={(e) => setNewThemeName(e.target.value)}
                          placeholder={selectedTheme.displayName}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Theme slug:{" "}
                          {newThemeName ? slugify(newThemeName) : "..."}
                        </p>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsRenameDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleRenameTheme}>Rename</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>

          {/* Factory Theme Notice (if applicable) */}
          {selectedTheme.isFactory && (
            <div className="p-3 bg-muted rounded-md text-sm mb-6">
              <div className="flex flex-wrap gap-2">
                <div>
                  <span className="text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5">
                    Factory Theme
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid (Colors | CSS / Preview) */}
          <div className="grid md:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] lg:grid-cols-[minmax(300px,_430px)_minmax(0,_1fr)] gap-6 mb-6">
            {/* Column 1: Colors */}
            <div className="border rounded-md">
              <div className="bg-muted p-3 border-b">
                <h3 className="text-sm font-medium">Colors</h3>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="p-4">
                  {cssVariables.map((variable) => (
                    <VariableRow
                      key={variable.name}
                      variable={variable}
                      value={resolvedValues[variable.name] || "#000000"}
                      isOverridden={isVariableOverridden(variable.name)}
                      onColorChange={(value) =>
                        handleColorChange(variable.name, value)
                      }
                      onReset={() => handleResetVariable(variable.name)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
            {/* Column 2: CSS and Preview (stacked) */}
            <div className="flex flex-col gap-0">
              {/* Row 1 */}

              <div className="w-[515px]">
                <ThemePreview resolvedValues={resolvedValues} />
              </div>
              <br />
              {/* Row 2 */}

              <div className="p-0 w-[515px]">
                <ContrastChecker resolvedValues={resolvedValues} />
              </div>
              <br />
              <div className="p-0 w-[515px]">
                <CssView code={cssOutput} onPaste={handleCssPaste} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeEditor;
