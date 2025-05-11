
import React, { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { toast } from "sonner";
import { Theme } from "../../types/theme-editor";
import { slugify, generateId } from "../../utils/theme-utils";

interface ImageUploadProps {
  onThemeGenerated: (themes: Theme[]) => void;
}

const ImageUpload = ({ onThemeGenerated }: ImageUploadProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedThemes, setGeneratedThemes] = useState<Theme[]>([]);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
          setGeneratedThemes([]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImage(event.target.result as string);
              setGeneratedThemes([]);
            }
          };
          reader.readAsDataURL(blob);
        }
        break;
      }
    }
  };

  const generateThemes = async () => {
    if (!image) {
      toast.error("Please upload an image first");
      return;
    }

    setIsLoading(true);

    try {
      // For this demo, we'll generate 4 placeholder themes
      // In a real implementation, this would be an API call to an AI service
      const generateSampleThemes = () => {
        const colorPalettes = [
          {
            primary: "#9b87f5", // Purple
            secondary: "#ffffff", // White
            accent: "#f2fce2", // Soft Green
          },
          {
            primary: "#0ea5e9", // Ocean Blue
            secondary: "#f1f0fb", // Soft Gray
            accent: "#fec6a1", // Soft Orange
          },
          {
            primary: "#d946ef", // Magenta Pink
            secondary: "#1a1f2c", // Dark Purple
            accent: "#fef7cd", // Soft Yellow
          },
          {
            primary: "#8b5cf6", // Vivid Purple
            secondary: "#fde1d3", // Soft Peach
            accent: "#d3e4fd", // Soft Blue
          }
        ];

        return colorPalettes.map((palette, index) => {
          const name = `Image Theme ${index + 1}`;
          return {
            id: generateId(),
            displayName: name,
            slug: slugify(name),
            isFactory: false,
            variables: {
              "--game-primary-color": palette.primary,
              "--game-secondary-color": palette.secondary,
              "--game-button-wrong-bg-color": palette.accent,
            }
          };
        });
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const themes = generateSampleThemes();
      
      setGeneratedThemes(themes);
      setCurrentThemeIndex(0);
      
      // Pass the first theme up to the parent component
      onThemeGenerated(themes);
      
      toast.success("Generated 4 themes based on your image!");
    } catch (error) {
      console.error("Error generating themes:", error);
      toast.error("Failed to generate themes");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevTheme = () => {
    const newIndex = currentThemeIndex > 0 ? currentThemeIndex - 1 : generatedThemes.length - 1;
    setCurrentThemeIndex(newIndex);
    onThemeGenerated([generatedThemes[newIndex]]);
  };

  const handleNextTheme = () => {
    const newIndex = currentThemeIndex < generatedThemes.length - 1 ? currentThemeIndex + 1 : 0;
    setCurrentThemeIndex(newIndex);
    onThemeGenerated([generatedThemes[newIndex]]);
  };

  return (
    <div className="space-y-4">
      <Card className={`border-2 border-dashed ${image ? 'border-primary' : 'border-muted'} rounded-md p-4`}
        onPaste={handlePaste}
        tabIndex={0}
        onKeyDown={(e) => e.key === "v" && e.ctrlKey && e.currentTarget.focus()}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-4 cursor-pointer">
          {image ? (
            <div className="relative">
              <img 
                src={image} 
                alt="Uploaded" 
                className="max-h-32 max-w-full object-contain rounded-md"
              />
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or paste an image
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </Card>

      <div className="flex items-center gap-2">
        <Button 
          onClick={generateThemes} 
          className="w-full" 
          disabled={!image || isLoading}
        >
          {isLoading ? "Generating..." : "Generate Themes from Image"}
        </Button>
      </div>

      {generatedThemes.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Theme {currentThemeIndex + 1} of {generatedThemes.length}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevTheme}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextTheme}
                className="h-8 w-8 p-0"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
