"use client";

import { type PropsWithChildren } from "react";
import { useIsMobile } from "~/lib/hooks/use-mobile";
import { Drawer } from "./drawer";
import { useRouter } from "next/navigation";
import { AlertDialog } from "./alert-dialog";

export const Modal = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const back = () => {
    router.back();
  };

  if (isMobile)
    return (
      <Drawer defaultOpen onOpenChange={back}>
        {children}
      </Drawer>
    );

  return (
    <AlertDialog defaultOpen onOpenChange={back}>
      {children}
    </AlertDialog>
  );
};
