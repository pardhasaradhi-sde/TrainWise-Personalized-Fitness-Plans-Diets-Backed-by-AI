export default function AuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full space-y-8 px-4">
        {/* Animated logo/title */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-primary opacity-30 blur-xl animate-pulse"></div>
            <h1 className="relative text-5xl font-bold font-mono">
              <span className="text-foreground">Train</span>
              <span className="text-primary">Wise</span>
            </h1>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        </div>

        {/* Loading card */}
        <div className="relative bg-card/80 backdrop-blur-sm border border-primary/30 rounded-lg p-8">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-primary/50"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-primary/50"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-primary/50"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-primary/50"></div>

          <div className="space-y-6">
            {/* Avatar skeleton */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 animate-pulse"></div>
            </div>

            {/* Form fields skeleton */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted/50 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-muted/30 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted/50 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-muted/30 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Button skeleton */}
            <div className="h-12 w-full bg-primary/30 rounded animate-pulse"></div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            {/* Social buttons skeleton */}
            <div className="space-y-3">
              <div className="h-10 w-full bg-muted/30 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-muted/30 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center items-center gap-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-8 bg-primary rounded-full animate-sound-wave"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
          <span className="font-mono text-primary text-sm">Loading authentication...</span>
        </div>
      </div>

      {/* Scan lines effect */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none opacity-20"></div>
      
      {/* Grid background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
    </div>
  );
}
