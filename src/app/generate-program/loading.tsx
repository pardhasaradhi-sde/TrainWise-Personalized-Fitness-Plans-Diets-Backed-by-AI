export default function GenerateProgramLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Cyberpunk header */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-30 blur-lg"></div>
          <div className="relative bg-card border border-primary/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center font-mono text-primary mb-2">
              INITIALIZING AI SYSTEM
            </h2>
            <p className="text-center text-muted-foreground text-sm">
              Preparing personalized fitness analysis
            </p>
          </div>
        </div>

        {/* Loading bars */}
        <div className="space-y-4">
          {[
            { label: "Loading AI Models", delay: "0s" },
            { label: "Analyzing Your Data", delay: "0.5s" },
            { label: "Generating Programs", delay: "1s" },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>{item.label}</span>
                <span className="text-primary">PROCESSING...</span>
              </div>
              <div className="h-2 bg-card border border-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse"
                  style={{ 
                    width: "100%",
                    animationDelay: item.delay,
                    animationDuration: "1.5s"
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Spinning hexagon */}
        <div className="flex justify-center pt-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-2 border-primary/50 rotate-0 animate-spin" 
                 style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            </div>
            <div className="absolute inset-2 border-2 border-secondary/50 rotate-0 animate-spin" 
                 style={{ 
                   clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                   animationDirection: "reverse",
                   animationDuration: "3s"
                 }}>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scan lines */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none opacity-20"></div>
    </div>
  );
}
