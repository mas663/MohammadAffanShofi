"use client";
import type { SpringOptions } from "motion/react";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface TiltedCardProps {
  imageSrc?: React.ComponentProps<"img">["src"];
  icon?: React.ReactNode;

  altText?: string;
  captionText?: string;

  containerHeight?: React.CSSProperties["height"];
  containerWidth?: React.CSSProperties["width"];
  imageHeight?: React.CSSProperties["height"];
  imageWidth?: React.CSSProperties["width"];

  scaleOnHover?: number;
  rotateAmplitude?: number;

  glowColor?: string;

  showMobileWarning?: boolean;
  showTooltip?: boolean;

  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  imageSrc,
  icon,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "120px",
  containerWidth = "120px",
  imageHeight = "120px",
  imageWidth = "120px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  glowColor = "rgb(56 189 248 / 0.55)",
  showMobileWarning = false,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }
  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="group relative h-full w-full [perspective:800px] flex items-center justify-center"
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        {/* --- Base card --- */}
        <div className="absolute inset-0 rounded-2xl bg-white/[0.04] border border-white/10 ring-1 ring-inset ring-white/5" />

        {/* --- Glow --- */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-[28px] blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(60% 60% at 50% 50%, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
            transform: "translateZ(0)",
          }}
        />

        {/* --- Konten: image atau icon --- */}
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={altText}
            className="absolute inset-0 object-cover rounded-2xl will-change-transform [transform:translateZ(6px)]"
            style={{ width: imageWidth, height: imageHeight }}
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center text-neutral-200 will-change-transform [transform:translateZ(12px)]"
            style={{ width: imageWidth, height: imageHeight }}
          >
            {/* ukuran icon mengikuti container */}
            <div className="text-4xl md:text-5xl">{icon}</div>
          </div>
        )}

        {/* (opsional) overlay di atas konten */}
        {displayOverlayContent && overlayContent && (
          <motion.div className="absolute inset-0 z-[2] will-change-transform [transform:translateZ(24px)]">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 z-[3] hidden rounded bg-white px-2.5 py-1 text-[10px] text-[#2d2d2d] opacity-0 sm:block"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
