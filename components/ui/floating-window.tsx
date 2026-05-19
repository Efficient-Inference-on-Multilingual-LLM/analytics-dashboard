"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, GripHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FloatingWindowProps {
  title: string;
  trigger?: React.ReactNode;
  triggerLabel?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  className?: string;
  bodyClassName?: string;
}

const FloatingWindow = ({
  title,
  trigger,
  triggerLabel,
  children,
  defaultOpen,
  defaultPosition,
  defaultSize,
  minSize,
  className,
  bodyClassName,
}: FloatingWindowProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [position, setPosition] = useState(
    defaultPosition || { x: 100, y: 100 },
  );
  const [size, setSize] = useState(defaultSize || { width: 300, height: 200 });

  const onDragStart = (event: React.MouseEvent) => {
    const startX = event.clientX - position.x;
    const startY = event.clientY - position.y;
    const onMove = (moveEvent: MouseEvent) => {
      setPosition({
        x: Math.max(0, moveEvent.clientX - startX),
        y: Math.max(0, moveEvent.clientY - startY),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    event.preventDefault();
  };

  const onResizeStart = (event: React.MouseEvent) => {
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const onMove = (moveEvent: MouseEvent) => {
      setSize({
        width: Math.max(
          minSize?.width || 100,
          startWidth + moveEvent.clientX - startX,
        ),
        height: Math.max(
          minSize?.height || 100,
          startHeight + moveEvent.clientY - startY,
        ),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    event.preventDefault();
  };

  return (
    <div className="relative">
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setIsOpen(true)}
          disabled={isOpen}
        >
          <GripHorizontal className="mr-1.5 h-3 w-3" />
          {triggerLabel}
        </Button>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height,
            minWidth: minSize?.width || 100,
            minHeight: minSize?.height || 100,
            zIndex: 50,
          }}
          className={cn(
            "flex flex-col rounded-lg border bg-popover text-popover-foreground shadow-md overflow-hidden select-none",
            className,
          )}
        >
          <div
            onMouseDown={onDragStart}
            className="flex items-center justify-between px-3 py-2 border-b bg-muted/40 cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <GripHorizontal className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className={cn("p-3", bodyClassName)}>{children}</div>
          </ScrollArea>
          <div
            onMouseDown={onResizeStart}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Resize"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="7" cy="7" r="1" />
              <circle cx="4" cy="7" r="1" />
              <circle cx="7" cy="4" r="1" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingWindow;
