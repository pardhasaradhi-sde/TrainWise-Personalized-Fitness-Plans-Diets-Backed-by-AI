"use client";
import { SignedIn, SignedOut,SignInButton } from "@clerk/clerk-react"
import { SignOutButton } from "@clerk/nextjs"

const Homepage = () => {
  return (
    <div>
      HomePage
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      
    </div>
  )
}

export default Homepage