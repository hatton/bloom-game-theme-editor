
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import presetThemes from "../../data/presetThemes.json";
import { Theme } from "../../types/theme-editor";
import { generateThemeCSS } from "../../utils/theme-utils";

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

  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center items-center my-4">
        <Button variant="outline" size="sm" onClick={handlePrevTheme}>
          ← Previous
        </Button>
        <span className="font-medium">
          {selectedPresetIndex + 1} of {presetThemes.length}: {currentPreset.displayName}
        </span>
        <Button variant="outline" size="sm" onClick={handleNextTheme}>
          Next →
        </Button>
      </div>

      {/* Theme Preview Card */}
      <Card className="overflow-hidden">
        <div 
          className="p-3 text-center font-medium"
          style={{
            backgroundColor: currentPreset.variables["--game-header-bg-color"] || resolvedValues["--game-header-bg-color"] || "#000000",
            color: currentPreset.variables["--game-header-color"] || resolvedValues["--game-header-color"] || "#ffffff"
          }}
        >
          {currentPreset.displayName}
        </div>
        <div 
          className="p-4"
          style={{
            backgroundColor: currentPreset.variables["--game-page-bg-color"] || resolvedValues["--game-page-bg-color"] || "#ffffff",
            color: currentPreset.variables["--game-text-color"] || resolvedValues["--game-text-color"] || "#000000"
          }}
        >
          <p className="mb-3">Sample text in {currentPreset.displayName} theme.</p>
          
          <div className="flex gap-2 mb-3">
            <button
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: currentPreset.variables["--game-button-bg-color"] || resolvedValues["--game-button-bg-color"] || "#ffffff",
                color: currentPreset.variables["--game-button-text-color"] || resolvedValues["--game-button-text-color"] || "#000000",
                border: `1px solid ${currentPreset.variables["--game-button-outline-color"] || resolvedValues["--game-button-outline-color"] || "#000000"}`
              }}
            >
              Normal Button
            </button>
            
            <button
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: currentPreset.variables["--game-button-correct-bg-color"] || resolvedValues["--game-button-correct-bg-color"] || "#000000",
                color: currentPreset.variables["--game-button-correct-color"] || resolvedValues["--game-button-correct-color"] || "#ffffff"
              }}
            >
              Correct Button
            </button>
            
            <button
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: currentPreset.variables["--game-button-wrong-bg-color"] || resolvedValues["--game-button-wrong-bg-color"] || "#848484",
                color: currentPreset.variables["--game-button-wrong-color"] || resolvedValues["--game-button-wrong-color"] || "#ffffff"
              }}
            >
              Wrong Button
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleUseTheme}>Use This Theme</Button>
            <Button variant="outline" onClick={handleCopyCSS}>
              <Copy className="h-4 w-4 mr-2" />
              Copy CSS
            </Button>
          </div>
        </div>
      </Card>

      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm">
          Browse through preset themes and click "Use This Theme" to apply them to your project. 
          You can also copy the generated CSS directly with the "Copy CSS" button.
        </p>
      </div>
    </div>
  );
};

export default PresetThemes;
