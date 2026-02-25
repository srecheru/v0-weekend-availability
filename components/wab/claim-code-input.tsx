"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

interface ClaimCodeInputProps {
  onReclaim: (code: string) => void;
}

export function ClaimCodeInput({ onReclaim }: ClaimCodeInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter your claim code");
      return;
    }
    setError("");
    onReclaim(code.trim().toLowerCase());
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <KeyRound className="size-4" />
        Reclaim your spot
      </div>
      <p className="text-xs text-muted-foreground">
        Enter the claim code you were given when you first joined.
      </p>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. mountain"
          className="flex-1"
          aria-label="Claim code"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="button" variant="outline" onClick={handleSubmit}>
          Reclaim
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
