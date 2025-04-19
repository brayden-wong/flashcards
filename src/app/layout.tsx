import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import type { PropsWithChildren } from "react";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Flashcards",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type Props = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

const RootLayout = async ({ children, modal }: Props) => (
  <ClerkProvider>
    <html lang="en">
      <body className={GeistSans.className}>
        <SignedOut>
          <header className="flex h-16 items-center justify-end gap-4 p-4">
            <SignInButton />
            <SignOutButton />
          </header>
        </SignedOut>
        <RenderChildren>
          <Toaster duration={5000} position="bottom-right" />
          {children}
          {modal}
        </RenderChildren>
      </body>
    </html>
  </ClerkProvider>
);

const RenderChildren = async ({ children }: PropsWithChildren) => {
  await auth.protect();

  return <SignedIn>{children}</SignedIn>;
};

export default RootLayout;
