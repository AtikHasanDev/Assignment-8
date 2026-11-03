"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="modal-overlay" />
        <DialogPrimitive.Content className="modal-content">
          <DialogPrimitive.Title className="text-3xl">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="muted mt-3 mb-6">
            {description}
          </DialogPrimitive.Description>
          {children}
          <DialogPrimitive.Close
            className="icon-button modal-close"
            aria-label="Close dialog"
          >
            <X size={20} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
