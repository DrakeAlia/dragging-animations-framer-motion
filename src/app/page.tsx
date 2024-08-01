"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  MotionStyle,
  useMotionValueEvent,
} from "framer-motion";
import { useState } from "react";

export default function Home() {
  return (
    <>
      <FoldableMap />
    </>
  );
}

const FoldableMap = () => {
  // Motion values for drag animation
  const xDrag = useMotionValue(0);
  const [isFolded, setIsFolded] = useState(true); // State to track if map is folded

  // Transform functions for left and right sections
  const xLeftSection = useTransform(xDrag, [0, 300], ["100%", "0%"]);
  const xRightSection = useTransform(xDrag, [0, 300], ["-100%", "0%"]);

  // Transform functions for center section
  const centerScale = useTransform(xDrag, [150, 300], [0, 1]);
  const centerBrightness = useTransform(xDrag, [150, 300], [0.2, 1]);

  // Event listener for drag motion
  useMotionValueEvent(xDrag, "change", (currentX) => {
    if (currentX > 260) {
      setIsFolded(false);
    } else {
      setIsFolded(true);
    }
  });

  return (
    <div className="overflow-x-clip">
      <motion.div
        animate={isFolded ? "folded" : "open"} // Animation based on folded state
        variants={{
          open: { scale: 1 },
          folded: { scale: 0.9 },
        }}
        initial="folded" // Initial state is folded
        className="relative flex flex-col items-center"
      >
        <motion.div
          variants={{ open: { rotate: 0 }, hovering: { rotate: 0 } }}
          whileHover="hovering"
          initial={{ rotate: 3 }}
          className="grid aspect-video max-h-[80vh] w-full min-w-[600px] p-8"
        >
          <div className="grid grid-cols-3 [grid-area:1/1]">
            {/* Left section of the map */}
            <motion.div
              style={{ x: xLeftSection, skewY: "-1deg" }}
              className="map-image origin-bottom-right border-r border-[rgba(255,255,255,.1)] shadow-2xl"
            />
            {/* Center section of the map */}
            <motion.div
              style={
                {
                  scaleX: centerScale,
                  "--brightness": centerBrightness,
                } as MotionStyle
              }
              className="map-image brightness-[--brightness]"
            />
            {/* Right section of the map */}
            <motion.div
              style={{ x: xRightSection, skewY: "1deg" }}
              className="map-image origin-bottom-left border-l border-[rgba(255,255,255,.1)] shadow-2xl"
            />
          </div>
          {/* Draggable area */}
          <motion.div
            drag="x"
            _dragX={xDrag}
            dragConstraints={{ left: 0, right: 300 }}
            dragTransition={{
              modifyTarget: (target) => {
                return target > 150 ? 300 : 0;
              },
              timeConstant: 45,
            }}
            className="relative z-10 cursor-grab [grid-area:1/1] active:cursor-grabbing"
          />
        </motion.div>
        {/* Text below the map */}
        <motion.div
          variants={{
            folded: {
              opacity: 0,
              scale: 0.9,
              y: 30,
            },
            open: {
              opacity: 1,
              scale: 1,
              y: 0,
            },
          }}
          className="flex w-full justify-center text-xl font-semibold md:text-4xl"
        >
          <p className="rounded-2xl bg-white px-12 py-5 text-[hsl(73_69%_26%)]">
            Pick your favorite spot ☝️
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
