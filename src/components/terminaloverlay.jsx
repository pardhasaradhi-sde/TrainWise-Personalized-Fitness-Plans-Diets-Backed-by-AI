const TerminalOverlay = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className="relative bg-background/90 border border-border rounded-lg p-4 shadow-lg font-mono">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-2 border-b border-border pb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-xs text-primary font-medium tracking-wide">
              SYSTEM ACTIVE
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-medium tracking-widest">
            ID:78412.93
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary text-base font-semibold">&gt;</span>
          <span className="text-base text-foreground font-semibold tracking-tight">
            WORKOUT ANALYSIS{" "}
            <span className="text-primary">COMPLETE</span>
          </span>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="text-primary font-semibold">01</div>
            <span>
              30 min strength training{" "}
              <span className="text-primary/70">(upper body)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-primary font-semibold">02</div>
            <span>
              20 min cardio{" "}
              <span className="text-primary/70">(moderate intensity)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-primary font-semibold">03</div>
            <span>
              10 min flexibility{" "}
              <span className="text-primary/70">(recovery)</span>
            </span>
          </div>
        </div>

        <div className="absolute right-4 bottom-2 opacity-10 text-4xl select-none pointer-events-none font-black text-primary">
          AI
        </div>
      </div>
    </div>
  );
};
export default TerminalOverlay;