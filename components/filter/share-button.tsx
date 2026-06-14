"use client";
import React, { useState } from "react";
import type { PageKey } from "@/lib/url-state/registry";
import { encodeShareToken } from "@/lib/url-state/share";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  page: PageKey;
  state: Record<string, unknown>;
}

const ShareButton = ({ page, state }: ShareButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleShare = async () => {
    const token = encodeShareToken(page, state);
    const params = new URLSearchParams({ t: token });
    const url = `${window.location.origin}/s?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };
  return (
    <Button onClick={handleShare} variant="outline" size="sm">
      {isCopied ? "Copied" : "Share Link"}
    </Button>
  );
};

export default ShareButton;
