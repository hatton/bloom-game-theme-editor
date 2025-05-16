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

interface ContrastElement {
  name: string;
  textColor: string;
  bgColor: string;
  isLargeText: boolean;
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
      isLargeText: false, // 16px
    },
    {
      name: "Text",
      textColor: resolvedValues["--game-text-color"] || "#000000",
      bgColor: resolvedValues["--game-page-bg-color"] || "#ffffff",
      isLargeText: true, // 20px
    },
    {
      name: "Normal Button",
      textColor: resolvedValues["--game-button-text-color"] || "#000000",
      bgColor: resolvedValues["--game-button-bg-color"] || "#ffffff",
      isLargeText: true, // 20px
    },
    {
      name: "Correct Button",
      textColor: resolvedValues["--game-button-correct-color"] || "#ffffff",
      bgColor: resolvedValues["--game-button-correct-bg-color"] || "#000000",
      isLargeText: true, // 20px
    },
    {
      name: "Wrong Button",
      textColor: resolvedValues["--game-button-wrong-color"] || "#ffffff",
      bgColor: resolvedValues["--game-button-wrong-bg-color"] || "#848484",
      isLargeText: true, // 20px
    },
    {
      name: "Draggable",
      textColor: resolvedValues["--game-draggable-color"] || "#ffffff",
      bgColor: resolvedValues["--game-draggable-bg-color"] || "#000000",
      isLargeText: true, // 20px
    },
    {
      name: "Checkbox",
      textColor: resolvedValues["--game-checkbox-text-color"] || "#000000",
      bgColor: resolvedValues["--game-page-bg-color"] || "#ffffff",
      isLargeText: false, // 16px
    },
    {
      name: "Page Number",
      textColor: resolvedValues["--game-page-number-color"] || "#000000",
      bgColor: resolvedValues["--game-page-bg-color"] || "#ffffff",
      isLargeText: false, // 16px
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">WCAG Contrast Check</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Good (AA): Minimum ratio of 4.5:1 for small text, 3:1 for large
                text.
                <br />
                Best (AAA): Minimum ratio of 7:1 for small text, 4.5:1 for large
                text.
                <br />
                <br />
                Small text: 16px and under
                <br />
                Large text: Above 18.66px
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Element</TableHead>
              <TableHead>Contrast</TableHead>
              <TableHead className="whitespace-nowrap">
                Good (WCAG AA)
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Best (WCAG AAA)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {elementsToCheck.map((element) => {
              // Calculate the contrast ratio
              const ratio = contrastRatio(element.textColor, element.bgColor);

              // Determine if it passes based on text size
              const passesAA = element.isLargeText
                ? ratio >= 3.0 // AA large text
                : ratio >= 4.5; // AA small text
              const passesAAA = element.isLargeText
                ? ratio >= 4.5 // AAA large text
                : ratio >= 7.0; // AAA small text

              return (
                <TableRow key={element.name}>
                  <TableCell
                    style={{
                      backgroundColor: element.bgColor,
                      color: element.textColor,
                    }}
                    className="font-medium"
                  >
                    {element.name}
                  </TableCell>
                  <TableCell>{ratio.toFixed(2)}:1</TableCell>
                  <TableCell>
                    {passesAA ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
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
    </div>
  );
};

export default ContrastChecker;
