import { ScrollArea } from "../../components/ui/scroll-area";
import VariableRow from "./VariableRow";
import { CSSVariable, Theme } from "../../types/theme-editor";

interface ColorsEditorProps {
  cssVariables: CSSVariable[];
  resolvedValues: Record<string, string>;
  isVariableOverridden: (variableName: string) => boolean;
  onColorChange: (variableName: string, value: string) => void;
  onResetVariable: (variableName: string) => void;
}

const ColorsEditor = ({
  cssVariables,
  resolvedValues,
  isVariableOverridden,
  onColorChange,
  onResetVariable,
}: ColorsEditorProps) => {
  return (
    <div className="border rounded-md">
      <div className="bg-muted p-3 border-b">
        <h3 className="text-sm font-medium">Colors</h3>
      </div>
      <ScrollArea className="h-[calc(100vh_-_200px)]">
        <div className="p-4">
          {cssVariables.map((variable) => (
            <VariableRow
              key={variable.name}
              variable={variable}
              value={resolvedValues[variable.name] || "#000000"}
              isOverridden={isVariableOverridden(variable.name)}
              onColorChange={(value) => onColorChange(variable.name, value)}
              onReset={() => onResetVariable(variable.name)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ColorsEditor;
