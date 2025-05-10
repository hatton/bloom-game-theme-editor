
import React from "react";
import { Button } from "../../components/ui/button";
import { Copy } from "lucide-react";
import { Card } from "../../components/ui/card";
import { toast } from "sonner";

interface CodePreviewProps {
  code: string;
}

const CodePreview = ({ code }: CodePreviewProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("CSS copied to clipboard");
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between bg-muted p-2 border-b">
        <h3 className="text-sm font-medium">Generated CSS</h3>
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
      <pre className="p-4 text-sm overflow-x-auto bg-muted/30 h-64 font-mono">
        {code}
      </pre>
    </Card>
  );
};

export default CodePreview;
