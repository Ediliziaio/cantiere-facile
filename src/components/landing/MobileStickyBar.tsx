import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-[hsl(30,6%,90%)] px-4 py-3 safe-area-bottom">
      <Button
        asChild
        className="w-full rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white font-landing-body font-semibold h-11"
      >
        <Link to="/register">Inizia gratis</Link>
      </Button>
    </div>
  );
}
