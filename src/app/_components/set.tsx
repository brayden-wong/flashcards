"use client";

import {
  EllipsisVertical,
  FilePen,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useMutation } from "~/lib/hooks/use-mutation";
import { request } from "~/lib/utils";
import type { DeleteSetRoute } from "../api/set/route";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SubmitButton } from "~/components/ui/submit-button";

type Props = {
  set: { id: string; name: string };
};

export const SetCard = ({ set }: Props) => {
  const [open, onOpenChange] = useState(false);

  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSingleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    cardRef.current?.focus();
  };

  const handleDoubleClick = () => {
    router.push(`/set/${set.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      router.push(`/set/${set.id}`);
    }
  };

  return (
    <div
      role="button"
      ref={cardRef}
      tabIndex={0}
      className="relative cursor-pointer rounded-md border bg-secondary py-2 pl-4 pr-2 shadow outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onKeyDown={handleKeyDown}
      aria-label={`View set ${set.name}`}
    >
      <div className="flex items-center justify-between gap-4">
        <FileSpreadsheet className="mr-2 flex-shrink-0" />
        <Link
          href={`/set/${set.id}`}
          className="flex-grow overflow-hidden"
          tabIndex={-1}
          aria-hidden="true"
          onClick={handleSingleClick}
          onDoubleClick={handleDoubleClick}
        >
          <h2 className="truncate text-right text-xl font-semibold">
            {set.name}
          </h2>
          <span className="absolute inset-0" />
        </Link>
        <AlertDialog open={open} onOpenChange={onOpenChange}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative z-10 size-7 p-0 hover:bg-primary hover:text-primary-foreground"
              >
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem className="relative flex items-center gap-2">
                  <FilePen className="size-4" />
                  <Link href={`/set/${set.id}/update`}>
                    Update
                    <span className="sr-only">Update set {set.name}</span>
                    <span className="absolute inset-0" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="relative flex items-center gap-2">
                  <AlertDialogTrigger>
                    <div className="flex items-center gap-2">
                      <Trash2 className="size-4" />
                      Delete
                      <span className="sr-only">Delete set {set.name}</span>
                      <span className="absolute inset-0" />
                    </div>
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Set</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this set? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <DialogAction id={set.id} close={() => onOpenChange(false)} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const DialogAction = ({ id, close }: { id: string; close: () => void }) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await request<DeleteSetRoute>("/api/set", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (!response.success) throw new Error(response.error);

      router.refresh();

      return response.data;
    },
    onError: (err) => toast(err.message),
    onSuccess: (res) => {
      toast(res);

      setTimeout(() => close(), 250);
    },
  });

  return (
    <AlertDialogFooter>
      <SubmitButton
        variant="destructive"
        isPending={isPending}
        onClick={() => mutate({ id })}
      >
        Delete
      </SubmitButton>
      <AlertDialogCancel>Close</AlertDialogCancel>
    </AlertDialogFooter>
  );
};
