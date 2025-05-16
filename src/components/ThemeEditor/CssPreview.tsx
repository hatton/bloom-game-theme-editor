import React from "react";
import { Button } from "../ui/button";
import { Copy, ClipboardPaste } from "lucide-react";
import { Card } from "../ui/card";
import { toast } from "sonner";

interface CssPreviewProps {
  code: string;
  onPaste?: (css: string) => void;
}

const CssPreview = ({ code, onPaste }: CssPreviewProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("CSS copied to clipboard");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && onPaste) {
        onPaste(text);
        toast.success("CSS pasted and theme updated");
      }
    } catch (err) {
      toast.error("Failed to read clipboard contents");
      console.error("Clipboard error:", err);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between bg-muted p-2 border-b">
        <h3 className="text-sm font-medium">CSS</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={handlePaste}
          >
            <ClipboardPaste className="h-4 w-4 mr-2" />
            Paste
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>
      <pre className="p-4 text-sm overflow-x-auto bg-muted/30 h-64 font-mono">
        {code}
      </pre>
    </Card>
  );
};

export default CssPreview;
