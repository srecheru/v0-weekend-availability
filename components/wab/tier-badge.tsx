"use client";

import { cn } from "@/lib/utils";
import { TIER_CONFIG, type TierType } from "@/lib/weekend-utils";

export function TierBadge({
  tier,
  className,
}: {
  tier: TierType;
  className?: string;
}) {
  const config = TIER_CONFIG[tier];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
