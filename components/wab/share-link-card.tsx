"use client";

import { useState } from "react";
import { usePrototype } from "@/lib/prototype-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Link } from "lucide-react";

export function ShareLinkCard() {
  const { board } = usePrototype();
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/boards/${board.boardId}/participant-join?joinToken=${board.joinToken}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Link className="size-4" />
          Share this link with your group
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 truncate rounded-md bg-muted px-3 py-2 text-xs font-mono text-muted-foreground select-all">
            {shareUrl}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="shrink-0"
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="size-4 text-tier-everyone-free" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
