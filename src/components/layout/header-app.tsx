const HeaderApp = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#E6E9ED] bg-white px-6">
      <div>
        <p className="text-sm font-medium text-foreground">Procurement Management</p>

        <p className="text-xs text-muted-foreground">Manage procurement and inventory operations</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#043C86] text-xs font-semibold text-white">JD</div>

        <div className="leading-tight">
          <p className="text-sm font-medium">John Doe</p>

          <p className="text-xs text-muted-foreground">User</p>
        </div>
      </div>
    </header>
  );
};

export default HeaderApp;
