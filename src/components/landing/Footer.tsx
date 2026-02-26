const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
            <span className="font-display text-xs font-bold text-primary">V</span>
          </div>
          <span className="font-display text-sm font-bold gradient-text">VaultIQ</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Docs</a>
          <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          <a href="#" className="hover:text-primary transition-colors">Community</a>
          <a href="#" className="hover:text-primary transition-colors">BscScan</a>
        </div>
        <span className="text-xs text-muted-foreground">
          © 2026 VaultIQ. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
