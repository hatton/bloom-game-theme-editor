import React, { useMemo, useRef } from "react";
import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import "../../styles/themeRules.css";
import { Card, CardContent, CardHeader } from "../ui/card";

interface ThemePreviewProps {
  resolvedValues: Record<string, string>;
  themeTitle?: string;
}

const ThemePreview = ({ resolvedValues, themeTitle }: ThemePreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);

  // Create a style element with CSS variables
  const themeStyle = useMemo(() => {
    const styleElement = document.createElement("style");

    // Create CSS rule with all the variables
    let cssText = ":root {\n";
    Object.entries(resolvedValues).forEach(([key, value]) => {
      cssText += `  ${key}: ${value};\n`;
    });
    cssText += "}";

    styleElement.textContent = cssText;
    return styleElement;
  }, [resolvedValues]);

  // Apply the theme style to the document when the component mounts
  // and remove it when it unmounts
  React.useEffect(() => {
    document.head.appendChild(themeStyle);
    return () => {
      document.head.removeChild(themeStyle);
    };
  }, [themeStyle]);

  // Function to capture the preview div as PNG and copy to clipboard
  const copyPreviewAsImage = async () => {
    if (!previewRef.current) return;

    try {
      // Use html-to-image to convert the div to a canvas
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            // Create a ClipboardItem and write to clipboard
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            toast.success("Theme preview copied to clipboard");
          } catch (err) {
            console.error("Clipboard write failed:", err);

            // Fallback: download the image if clipboard write fails
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `theme-preview-${themeTitle || "custom"}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Theme preview downloaded (clipboard access denied)");
          }
        }
      }, "image/png");
    } catch (err) {
      console.error("Error creating image:", err);
      toast.error("Failed to copy preview");
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between bg-muted p-2 border-b">
        <h3 className="text-sm font-medium">Preview</h3>
        {themeTitle && <div className="text-sm font-medium">{themeTitle}</div>}
        <Button
          variant="outline"
          size="sm"
          onClick={copyPreviewAsImage}
          className="ml-auto flex gap-1 items-center"
        >
          <Copy className="h-4 w-4" />
          <span>Copy Image</span>
        </Button>
      </div>
      <br />

      <CardContent>
        <div ref={previewRef} className="border rounded-md overflow-hidden">
          <div
            className="p-3 text-center font-medium"
            style={{
              backgroundColor:
                resolvedValues["--game-header-bg-color"] || "#000000",
              color: resolvedValues["--game-header-color"] || "#ffffff",
            }}
          >
            Instructions in the Header
          </div>

          {themeTitle && (
            <div
              className="p-3 text-center font-medium"
              style={{
                backgroundColor:
                  resolvedValues["--game-header-bg-color"] || "#000000",
                color: resolvedValues["--game-header-color"] || "#ffffff",
              }}
            >
              {themeTitle}
            </div>
          )}
          <div
            className="p-4"
            style={{
              backgroundColor:
                resolvedValues["--game-page-bg-color"] || "#ffffff",
              color: resolvedValues["--game-text-color"] || "#000000",
            }}
          >
            <p className="mb-3">This is sample text in the theme.</p>

            <div className="flex gap-2 mb-3">
              <button
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor:
                    resolvedValues["--game-button-bg-color"] || "#ffffff",
                  color:
                    resolvedValues["--game-button-text-color"] || "#000000",
                  border: `1px solid ${resolvedValues["--game-button-outline-color"] || "#000000"}`,
                }}
              >
                Normal Button
              </button>

              <button
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor:
                    resolvedValues["--game-button-correct-bg-color"] ||
                    "#000000",
                  color:
                    resolvedValues["--game-button-correct-color"] || "#ffffff",
                }}
              >
                Correct Button
              </button>

              <button
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor:
                    resolvedValues["--game-button-wrong-bg-color"] || "#848484",
                  color:
                    resolvedValues["--game-button-wrong-color"] || "#ffffff",
                }}
              >
                Wrong Button
              </button>
            </div>

            <div
              className="p-2 rounded mb-3"
              style={{
                backgroundColor:
                  resolvedValues["--game-draggable-bg-color"] || "#000000",
                color: resolvedValues["--game-draggable-color"] || "#ffffff",
                border: `1px solid ${resolvedValues["--game-draggable-target-outline-color"] || "#000000"}`,
              }}
            >
              Draggable Element
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded"
                  style={{
                    border: `2px solid ${resolvedValues["--game-checkbox-outline-color"] || "#000000"}`,
                    backgroundColor: "transparent",
                  }}
                ></div>
                <span
                  style={{
                    color:
                      resolvedValues["--game-checkbox-text-color"] || "#000000",
                  }}
                >
                  Normal Checkbox
                </span>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{
                    border: `2px solid ${resolvedValues["--game-selected-checkbox-outline-color"] || "#000000"}`,
                    backgroundColor:
                      resolvedValues["--game-selected-checkbox-bg-color"] ||
                      "#000000",
                  }}
                >
                  <div
                    className="w-3 h-3 text-xs flex items-center justify-center"
                    style={{
                      color:
                        resolvedValues["--game-selected-checkbox-color"] ||
                        "#ffffff",
                    }}
                  >
                    ✓
                  </div>
                </div>
                <span
                  style={{
                    color:
                      resolvedValues["--game-checkbox-text-color"] || "#000000",
                  }}
                >
                  Selected Checkbox
                </span>
              </div>
            </div>

            <div
              className="text-xs text-right mt-4"
              style={{
                color: resolvedValues["--game-page-number-color"] || "#000000",
              }}
            >
              Page 1
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemePreview;
