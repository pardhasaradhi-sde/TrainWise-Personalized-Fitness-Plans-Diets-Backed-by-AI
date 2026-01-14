"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "./loadingspinner";

export default function PageTransitionLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <LoadingSpinner />
    </div>
  );
}
