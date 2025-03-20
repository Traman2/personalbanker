import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react"; // Adjust the import path as needed

function ToasterLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <main>{children}</main>
      <Toaster />
    </div>
  );
}

export default ToasterLayout;
