"use client";
import { SignIn } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import AuthLoading from '../../loading'

const Signinpage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AuthLoading />;
  }

  return <main className='flex h-screen w-full items-center justify-center relative'>
    {/* Cyberpunk background elements */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
      <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
    </div>
    
    {/* Animated corners */}
    <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30 animate-pulse"></div>
    <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30 animate-pulse"></div>
    <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/30 animate-pulse"></div>
    <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/30 animate-pulse"></div>
    
    {/* Main content with animation */}
    <div className="animate-fadeIn">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-card/90 backdrop-blur-sm border-primary/20",
          }
        }}
      />
    </div>
    
    {/* Scan lines */}
    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none opacity-10"></div>
  </main>
}

export default Signinpage