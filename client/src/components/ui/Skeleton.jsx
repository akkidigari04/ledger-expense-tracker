import React from 'react';

export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-5 w-20" />
      </div>
      <div className="skeleton h-3 w-48" />
      <div className="skeleton h-3 w-24" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="card p-5 space-y-2">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton h-8 w-36" />
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
