import { Search, Bell } from "lucide-react";

const TopBar = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search batches, actors, products..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-[18px] h-[18px] text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cp-danger" />
        </button>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Nestlé India</p>
            <p className="text-[11px] text-muted-foreground">Enterprise Account</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            N
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
