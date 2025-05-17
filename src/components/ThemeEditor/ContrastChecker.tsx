import React from "react";
import { contrastRatio } from "wcag-contrast-utils";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Card } from "../ui/card";

const namedColorToHex = (color: string): string => {
  // Create a temporary element to use the browser's color parsing
  const tempEl = document.createElement("div");
  tempEl.style.color = color;
  document.body.appendChild(tempEl);
  const computedColor = window.getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);

  // Convert rgb(r, g, b) to hex
  const match = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (match) {
    const [_, r, g, b] = match;
    return `#${Number(r).toString(16).padStart(2, "0")}${Number(g)
      .toString(16)
      .padStart(2, "0")}${Number(b).toString(16).padStart(2, "0")}`;
  }

  // If it's already a hex color or couldn't be parsed, return as is
  return color;
};

interface ContrastElement {
  name: string;
  textColor: string;
  bgColor: string;
  defaultPtInBloom: number; // Storing font size, assuming px values as per previous comments
}

interface ContrastCheckerProps {
  resolvedValues: Record<string, string>;
}

const ContrastChecker = ({ resolvedValues }: ContrastCheckerProps) => {
  // Define all the text/background combinations to check
  const elementsToCheck: ContrastElement[] = [
    {
      name: "Header",
      textColor: resolvedValues["--game-header-color"] || "#ffffff",
      bgColor: resolvedValues["--game-header-bg-color"] || "#000000",
      defaultPtInBloom: 16,
    },
    {
      name: "Text",
      textColor: resolvedValues["--game-text-color"] || "#000000",
      bgColor: resolvedValues["--game-page-bg-color"] || "#ffffff",
      defaultPtInBloom: 30,
    },
    {
      name: "Normal Button",
      textColor: resolvedValues["--game-button-text-color"] || "#000000",
      bgColor: resolvedValues["--game-button-bg-color"] || "#ffffff",
      defaultPtInBloom: 31,
    },
    {
      name: "Correct Button",
      textColor: resolvedValues["--game-button-correct-color"] || "#ffffff",
      bgColor: resolvedValues["--game-button-correct-bg-color"] || "#000000",
      defaultPtInBloom: 31,
    },
    {
      name: "Wrong Button",
      textColor: resolvedValues["--game-button-wrong-color"] || "#ffffff",
      bgColor: resolvedValues["--game-button-wrong-bg-color"] || "#848484",
      defaultPtInBloom: 31,
    },
    {
      name: "Draggable",
      textColor: resolvedValues["--game-draggable-color"] || "#ffffff",
      bgColor: resolvedValues["--game-draggable-bg-color"] || "#000000",
      defaultPtInBloom: 30,
    },
    {
      name: "Checkbox",
      textColor: resolvedValues["--game-checkbox-text-color"] || "#000000",
      bgColor: resolvedValues["--game-page-bg-color"] || "#ffffff",
      defaultPtInBloom: 16,
    },
    {
      name: "Page Number",
      textColor: resolvedValues["--game-page-number-color"] || "#000000",
      bgColor: resolvedValues["--game-page-bg-color"] || "#ffffff",
      defaultPtInBloom: 16,
    },
  ];

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between bg-muted p-2 border-b">
        <h3 className="text-sm font-medium">WCAG Contrast Check</h3>
      </div>
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Element</TableHead>
              <TableHead className="whitespace-nowrap">Good (AA)</TableHead>
              <TableHead className="whitespace-nowrap">Best (AAA)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {elementsToCheck.map((element) => {
              // Convert colors to hex format
              const textColorHex = namedColorToHex(element.textColor);
              const bgColorHex = namedColorToHex(element.bgColor);

              // Calculate the contrast ratio with hex values
              const ratio = contrastRatio(textColorHex, bgColorHex);

              // output all details to console

              // Determine if it passes based on text size
              // WCAG: Large text is 18pt (approx 24px) or 14pt bold (approx 18.66px bold)
              // Assuming non-bold text for this calculation.
              const isLargeText = element.defaultPtInBloom >= 18;

              const passesAA = isLargeText
                ? ratio >= 3.0 // AA large text
                : ratio >= 4.5; // AA small text
              const passesAAA = isLargeText
                ? ratio >= 4.5 // AAA large text
                : ratio >= 7.0; // AAA small text

              const contrastTitle = `Contrast: ${ratio.toFixed(2)}:1 (Font size: ${element.defaultPtInBloom}px)`;

              // output all details to console
              const contrastDetails = `${element.name} in ${element.defaultPtInBloom}pt,  ${textColorHex} on ${bgColorHex}, Ratio: ${ratio.toFixed(
                2
              )}:1, Passes AA: ${passesAA}, Passes AAA: ${passesAAA}`;

              return (
                <TableRow key={element.name}>
                  <TableCell
                    style={{
                      backgroundColor: element.bgColor,
                      color: element.textColor,
                    }}
                    className="font-medium"
                    title={contrastDetails}
                  >
                    {element.name}
                  </TableCell>
                  <TableCell title={contrastDetails}>
                    {passesAA ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell title={contrastDetails}>
                    {passesAAA ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ContrastChecker;
