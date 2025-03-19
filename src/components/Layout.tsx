import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react"; // Adjust the import path as needed

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <main>{children}</main>
      <Toaster />
    </div>
  );
}

export default RootLayout;
