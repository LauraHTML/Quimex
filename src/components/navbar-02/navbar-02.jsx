import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { SunIcon } from "lucide-react";
import Image from "next/image";

const Navbar02Page = () => {
  return (
    <nav className="h-25 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo + Menu Desktop */}
        <div className="flex items-center gap-5">
          <Logo />
          {/* Menu Desktop (some no mobile) */}
          <div className="hidden md:block">
            <NavMenu />
          </div>
        </div>

        {/* Ações à direita */}
        <div className="flex items-center gap-3">
          <Button>Área Restrita</Button>

          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar02Page;
