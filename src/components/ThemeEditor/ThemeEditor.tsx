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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import VariableRow from "./VariableRow";
import CodePreview from "./CodePreview";
import PresetThemes from "./PresetThemes";
import ThemePreview from "./ThemePreview";
import {
  cssVariables,
  factoryThemes,
  generateThemeCSS,
  resolveVariableValue,
  slugify,
  getDerivationMap,
  generateId,
} from "../../utils/theme-utils";
import { ParsedTheme, Theme } from "../../types/theme-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Palette } from "lucide-react";

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
    "--game-primary-color": "#9b87f5", // Purple primary
    "--game-secondary-color": "#ffffff", // White secondary
  },
};

const ThemeEditor = ({
  initialThemes = [],
  onThemeChange,
}: ThemeEditorProps) => {
  // State
  const [themes, setThemes] = useState<Theme[]>([defaultCustomTheme, ...factoryThemes, ...initialThemes]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(defaultCustomTheme.id); // Default to custom theme
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

  const handleDeleteTheme = () => {
    if (!selectedTheme || selectedTheme.isFactory) return;

    const updatedThemes = themes.filter((theme) => theme.id !== selectedTheme.id);
    setThemes(updatedThemes);
    
    // Select the first theme after deletion
    if (updatedThemes.length > 0) {
      setSelectedThemeId(updatedThemes[0].id);
    }
    
    toast.success(`Deleted theme: ${selectedTheme.displayName}`);
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
      toast.error("Factory themes cannot be modified. Duplicate the theme to edit it.");
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
    const { [variableName]: _, ...remainingVariables } = selectedTheme.variables;

    const updatedTheme: Theme = {
      ...selectedTheme,
      variables: remainingVariables,
    };

    const updatedThemes = themes.map((theme) =>
      theme.id === selectedTheme.id ? updatedTheme : theme
    );

    setThemes(updatedThemes);
  };

  // Function to parse CSS theme
  const parseCssTheme = (css: string): ParsedTheme => {
    const result: ParsedTheme = {
      variables: {}
    };
    
    // Find theme class selector block
    const themeMatch = css.match(/\.bloom-page\.game-theme-([a-zA-Z0-9-_]+)\s*{([^}]*)}/);
    
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

  // Handle CSS paste
  const handleCssPaste = (css: string) => {
    if (!selectedTheme) return;
    
    // Don't allow changes to factory themes
    if (selectedTheme.isFactory) {
      toast.error("Factory themes cannot be modified. Duplicate the theme to edit it.");
      return;
    }

    try {
      // Parse CSS to extract variables
      const parsedTheme = parseCssTheme(css);
      
      if (Object.keys(parsedTheme.variables).length === 0) {
        toast.error("No valid CSS variables found in pasted content");
        return;
      }
      
      // Update the theme with parsed variables
      const updatedTheme: Theme = {
        ...selectedTheme,
        variables: parsedTheme.variables,
      };

      const updatedThemes = themes.map((theme) =>
        theme.id === selectedTheme.id ? updatedTheme : theme
      );

      setThemes(updatedThemes);
      toast.success(`Updated theme with ${Object.keys(parsedTheme.variables).length} variables`);
    } catch (error) {
      toast.error("Failed to parse CSS. Make sure the format is correct.");
      console.error("CSS parsing error:", error);
    }
  };

  // Use Preset Theme
  const handleUsePresetTheme = (presetTheme: Theme) => {
    // Check if a theme with similar ID already exists
    const existingTheme = themes.find(theme => theme.id === presetTheme.id);
    
    if (existingTheme) {
      // Update the existing theme
      const updatedThemes = themes.map((theme) =>
        theme.id === presetTheme.id ? { ...presetTheme, isFactory: false } : theme
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
              <CardTitle>Bloom Games Theme Editor</CardTitle>
              <CardDescription>
                Customize color themes for your games
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">New Theme</Button>
                </DialogTrigger>
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
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="editor" className="flex-1">Manual Editor</TabsTrigger>
              <TabsTrigger value="ideas" className="flex-1">
                <Palette className="h-4 w-4 mr-2" />
                Theme Ideas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="theme-select">Select Theme</Label>
                      <Select
                        value={selectedThemeId}
                        onValueChange={handleThemeSelect}
                      >
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
                    <div className="flex gap-2 self-end">
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
                                  Theme slug: {newThemeName ? slugify(newThemeName) : "..."}
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

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Theme</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <span className="font-medium">
                                    {selectedTheme.displayName}
                                  </span>
                                  ? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteTheme}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {selectedTheme.isFactory && (
                    <div className="p-3 bg-muted rounded-md text-sm">
                      <div className="flex flex-wrap gap-2">
                        <div>
                          <span className="text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5">
                            Factory Theme
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Variable editor */}
                  <div className="border rounded-md">
                    <div className="bg-muted p-3 border-b">
                      <h3 className="text-sm font-medium">Colors</h3>
                    </div>
                    <ScrollArea className="h-[500px]">
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
                </div>

                <div>
                  <Label>Theme CSS Preview</Label>
                  <div className="mt-1">
                    <CodePreview 
                      code={cssOutput} 
                      onPaste={handleCssPaste}
                    />
                  </div>
                  <div className="mt-4">
                    <Label>Theme Preview</Label>
                    <div className="mt-2">
                      <ThemePreview resolvedValues={resolvedValues} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ideas" className="mt-0">
              <PresetThemes 
                onThemeSelect={handleUsePresetTheme}
                resolvedValues={resolvedValues}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeEditor;
