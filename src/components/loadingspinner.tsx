export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-24 h-24 border-4 border-primary/20 rounded-full"></div>
        
        {/* Spinning ring */}
        <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        
        {/* Inner glow */}
        <div className="absolute inset-2 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_20px_rgba(24,206,242,0.8)]"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="mt-8 flex items-center gap-2 font-mono text-primary">
        <span className="text-lg">Loading</span>
        <div className="flex gap-1">
          <span className="animate-pulse" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
          <span className="animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
        </div>
      </div>
      
      {/* Scan lines effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none opacity-30"></div>
    </div>
  );
}
