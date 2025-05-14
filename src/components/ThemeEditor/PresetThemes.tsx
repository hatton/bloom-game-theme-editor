
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import presetThemes from "../../data/presetThemes.json";
import { Theme } from "../../types/theme-editor";
import { generateThemeCSS } from "../../utils/theme-utils";
import ThemePreview from "./ThemePreview";

interface PresetThemesProps {
  onThemeSelect: (theme: Theme) => void;
  resolvedValues: Record<string, string>;
}

const PresetThemes = ({ onThemeSelect, resolvedValues }: PresetThemesProps) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  
  const handlePrevTheme = () => {
    setSelectedPresetIndex((prev) => 
      prev === 0 ? presetThemes.length - 1 : prev - 1
    );
  };

  const handleNextTheme = () => {
    setSelectedPresetIndex((prev) => 
      prev === presetThemes.length - 1 ? 0 : prev + 1
    );
  };

  const currentPreset = presetThemes[selectedPresetIndex];

  const handleUseTheme = () => {
    onThemeSelect(currentPreset as Theme);
    toast.success(`Selected theme: ${currentPreset.displayName}`);
  };

  const handleCopyCSS = () => {
    const css = generateThemeCSS(currentPreset as Theme);
    navigator.clipboard.writeText(css);
    toast.success("CSS copied to clipboard");
  };

  // Create a combined theme values for preview
  const combinedValues = {
    ...resolvedValues,
    ...currentPreset.variables
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center my-4">
        <Button variant="outline" size="sm" onClick={handlePrevTheme} className="ml-auto">
          ← Previous
        </Button>
        <span className="font-medium px-4">
          {selectedPresetIndex + 1} of {presetThemes.length}: {currentPreset.displayName}
        </span>
        <div className="flex gap-2 mr-auto">
          <Button variant="outline" size="sm" onClick={handleNextTheme}>
            Next →
          </Button>
          <Button size="sm" onClick={handleCopyCSS}>
            <Copy className="h-4 w-4 mr-2" />
            Copy CSS
          </Button>
        </div>
      </div>

      {/* Theme Preview using shared component */}
      <ThemePreview 
        resolvedValues={combinedValues}
        themeTitle={currentPreset.displayName} 
      />
    </div>
  );
};

export default PresetThemes;
