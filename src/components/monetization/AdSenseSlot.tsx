import React from "react";

interface AdSenseSlotProps {
  slotId: string;
  label?: string;
  format?: "horizontal" | "rectangle";
}

/**
 * Restrained, non-intrusive AdSense container with fixed minimum height
 * to prevent Cumulative Layout Shift (CLS). Never placed near upload or download controls.
 */
export function AdSenseSlot({
  slotId,
  label = "Advertisement",
  format = "horizontal",
}: AdSenseSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // If AdSense client ID is not yet configured in production env, render a zero-CLS restrained editorial separator
  if (!clientId) {
    return null;
  }

  return (
    <aside
      aria-label={label}
      className="my-8 border border-rule bg-surface/60 rounded p-3 text-center"
    >
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1.5">
        {label}
      </div>
      <div
        className={`w-full mx-auto flex items-center justify-center overflow-hidden ${
          format === "horizontal" ? "min-h-[90px]" : "min-h-[250px]"
        }`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
