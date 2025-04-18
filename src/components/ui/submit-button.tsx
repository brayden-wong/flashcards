"use client";

import { Button, type ButtonProps } from "./button";
import { LoadingSpinner } from "./loading-spinner";

type Props = Omit<ButtonProps, "type"> & { isPending?: boolean };

export const SubmitButton = ({
  isPending = false,
  disabled,
  children,
  ...props
}: Props) => (
  <Button {...props} disabled={isPending ?? disabled} type="submit">
    {isPending ? <LoadingSpinner /> : children}
  </Button>
);
