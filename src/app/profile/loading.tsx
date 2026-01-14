export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile header skeleton */}
        <div className="relative bg-card/90 backdrop-blur-sm border border-border rounded-xl p-8 overflow-hidden">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/30"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/30"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 animate-pulse">
            {/* Avatar skeleton */}
            <div className="w-32 h-32 rounded-full bg-primary/20 border-4 border-primary/30 shadow-[0_0_30px_rgba(24,206,242,0.3)]"></div>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              {/* Name skeleton */}
              <div className="h-10 w-64 bg-primary/20 rounded mx-auto md:mx-0"></div>
              
              {/* Email skeleton */}
              <div className="h-6 w-48 bg-muted/50 rounded mx-auto md:mx-0"></div>
              
              {/* Stats skeleton */}
              <div className="flex gap-6 justify-center md:justify-start pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-8 w-16 bg-primary/20 rounded"></div>
                    <div className="h-4 w-20 bg-muted/30 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content sections skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="bg-card/80 border border-border rounded-lg p-6 space-y-4 animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Section title */}
              <div className="h-6 w-32 bg-primary/20 rounded"></div>
              
              {/* Section content */}
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted/30 rounded"></div>
                <div className="h-4 w-4/5 bg-muted/30 rounded"></div>
                <div className="h-4 w-3/5 bg-muted/30 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading text with animation */}
        <div className="flex justify-center items-center gap-3 py-6">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-primary/50 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-2 border-primary rounded-full animate-spin"></div>
          </div>
          <span className="font-mono text-primary">Loading profile data</span>
        </div>
      </div>
      
      {/* Animated grid background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse"></div>
    </div>
  );
}
