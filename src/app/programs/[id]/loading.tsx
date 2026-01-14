export default function ProgramLoading() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6 animate-pulse">
          <div className="flex items-center gap-4">
            {/* Avatar skeleton */}
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30"></div>
            
            <div className="flex-1 space-y-3">
              {/* Name skeleton */}
              <div className="h-8 w-48 bg-primary/20 rounded"></div>
              
              {/* Details skeleton */}
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-muted/50 rounded"></div>
                <div className="h-4 w-32 bg-muted/50 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="border-b border-border">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-32 bg-primary/10 rounded-t animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Content skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="bg-card/80 border border-border rounded-lg p-6 space-y-4 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Title skeleton */}
              <div className="h-6 w-3/4 bg-primary/20 rounded"></div>
              
              {/* Lines skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted/30 rounded"></div>
                <div className="h-4 w-5/6 bg-muted/30 rounded"></div>
                <div className="h-4 w-4/6 bg-muted/30 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center items-center gap-3 py-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full animate-sound-wave"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
          <span className="font-mono text-primary text-sm">Loading program data...</span>
        </div>
      </div>
      
      {/* Scan lines */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none opacity-20"></div>
    </div>
  );
}
