
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

interface ContrastElement {
  name: string;
  textColor: string;
  bgColor: string;
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
    },
    {
      name: "Text",
      textColor: resolvedValues["--game-text-color"] || "#000000",
      bgColor: resolvedValues["--game-page-bg-color"] || "#ffffff",
    },
    {
      name: "Normal Button",
      textColor: resolvedValues["--game-button-text-color"] || "#000000",
      bgColor: resolvedValues["--game-button-bg-color"] || "#ffffff",
    },
    {
      name: "Correct Button",
      textColor: resolvedValues["--game-button-correct-color"] || "#ffffff",
      bgColor: resolvedValues["--game-button-correct-bg-color"] || "#000000",
    },
    {
      name: "Wrong Button",
      textColor: resolvedValues["--game-button-wrong-color"] || "#ffffff",
      bgColor: resolvedValues["--game-button-wrong-bg-color"] || "#848484",
    },
    {
      name: "Draggable",
      textColor: resolvedValues["--game-draggable-color"] || "#ffffff",
      bgColor: resolvedValues["--game-draggable-bg-color"] || "#000000",
    },
    {
      name: "Checkbox",
      textColor: resolvedValues["--game-checkbox-text-color"] || "#000000",
      bgColor: resolvedValues["--game-page-bg-color"] || "#ffffff",
    },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Contrast Check</h3>
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Element</TableHead>
              <TableHead>Contrast</TableHead>
              <TableHead className="whitespace-nowrap">WCAG AA Small</TableHead>
              <TableHead className="whitespace-nowrap">WCAG AA Large</TableHead>
              <TableHead className="whitespace-nowrap">WCAG AAA Small</TableHead>
              <TableHead className="whitespace-nowrap">WCAG AAA Large</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {elementsToCheck.map((element) => {
              // Calculate the contrast ratio
              const ratio = contrastRatio(element.textColor, element.bgColor);
              
              // Determine if it passes various WCAG criteria
              const passesAASmall = ratio >= 4.5;
              const passesAALarge = ratio >= 3;
              const passesAAASmall = ratio >= 7;
              const passesAAALarge = ratio >= 4.5;

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
                  <TableCell>
                    {ratio.toFixed(2)}:1
                  </TableCell>
                  <TableCell>
                    {passesAASmall ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {passesAALarge ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {passesAAASmall ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {passesAAALarge ? (
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
      <div className="text-xs text-muted-foreground mt-1">
        <p>WCAG Guidelines:</p>
        <ul className="list-disc list-inside ml-2">
          <li>AA Small Text: 4.5:1 minimum contrast ratio for text less than 18pt or 14pt bold</li>
          <li>AA Large Text: 3:1 minimum contrast ratio for text at least 18pt or 14pt bold</li>
          <li>AAA Small Text: 7:1 minimum contrast ratio for text less than 18pt or 14pt bold</li>
          <li>AAA Large Text: 4.5:1 minimum contrast ratio for text at least 18pt or 14pt bold</li>
        </ul>
      </div>
    </div>
  );
};

export default ContrastChecker;
