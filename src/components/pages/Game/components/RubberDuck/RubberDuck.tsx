import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, type PanInfo } from "framer-motion";
import { useSpinWheelStore } from "../../../../../store/spinWheelStore";

export function RubberDuck() {
  const { isRubberDuckActive, deactivateRubberDuck } = useSpinWheelStore();
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Use refs to hold the latest state for the animation loop, preventing stale closures.
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;

  const isActiveRef = useRef(isRubberDuckActive);
  isActiveRef.current = isRubberDuckActive;

  const DUCK_SIZE = 80;
  const GRAVITY = 0.6;
  const BOUNCE_DAMPING = 0.75;
  const FRICTION = 0.99;
  const MIN_VELOCITY_TO_STOP = 0.1;
  const THROW_MULTIPLIER = 0.07;

  // This effect runs only once to set up a persistent animation loop.
  useEffect(() => {
    const runPhysics = () => {
      // The loop is always running, but physics only apply under certain conditions.
      if (
        isActiveRef.current &&
        containerRef.current &&
        !isDraggingRef.current
      ) {
        const container = containerRef.current.getBoundingClientRect();
        const maxX = container.width - DUCK_SIZE;
        const maxY = container.height - DUCK_SIZE;

        // Apply gravity & friction
        velocityY.current += GRAVITY;
        velocityX.current *= FRICTION;

        let newX = x.get() + velocityX.current;
        let newY = y.get() + velocityY.current;

        // Bounce off walls
        if (newX <= 0 || newX >= maxX) {
          velocityX.current *= -BOUNCE_DAMPING;
          newX = newX <= 0 ? 0 : maxX;
        }

        if (newY <= 0 || newY >= maxY) {
          velocityY.current *= -BOUNCE_DAMPING;
          newY = newY <= 0 ? 0 : maxY;
          if (newY >= maxY) {
            velocityX.current *= 0.9; // Extra friction on ground
          }
        }

        x.set(newX);
        y.set(newY);

        // If it's slow and on the ground, let it rest. The loop continues but does nothing.
        if (
          Math.abs(velocityX.current) < MIN_VELOCITY_TO_STOP &&
          Math.abs(velocityY.current) < MIN_VELOCITY_TO_STOP &&
          newY >= maxY - 1
        ) {
          // Stop applying physics until it's thrown again
        }
      }
      // Keep the loop going
      animationFrameId.current = requestAnimationFrame(runPhysics);
    };

    // Start the single, persistent animation loop
    animationFrameId.current = requestAnimationFrame(runPhysics);

    // Cleanup on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once.

  // This effect handles the initial drop when the duck becomes active.
  useEffect(() => {
    if (isRubberDuckActive) {
      if (containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const randomX = Math.random() * (container.width - DUCK_SIZE);
        x.set(randomX);
        y.set(-DUCK_SIZE); // Start above the screen
        velocityX.current = (Math.random() - 0.5) * 5; // Give it a little push
        velocityY.current = 0;
      }
    }
  }, [isRubberDuckActive, x, y]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    // Stop any residual velocity
    velocityX.current = 0;
    velocityY.current = 0;
  }, []);

  const handleDragEnd = useCallback((_event: Event, info: PanInfo) => {
    setIsDragging(false);
    // Impart velocity from the drag gesture
    velocityX.current = info.velocity.x * THROW_MULTIPLIER;
    velocityY.current = info.velocity.y * THROW_MULTIPLIER;
  }, []);

  const handleDoubleClick = useCallback(() => {
    deactivateRubberDuck();
  }, [deactivateRubberDuck]);

  if (!isRubberDuckActive) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        drag
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDoubleClick={handleDoubleClick}
        style={{
          x,
          y,
          width: DUCK_SIZE,
          height: DUCK_SIZE,
        }}
        className="absolute pointer-events-auto cursor-grab active:cursor-grabbing select-none"
        whileDrag={{
          scale: 1.1,
          rotate: 5,
          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0">
            {/* Duck body - simple oval */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-14 h-12 bg-yellow-400 rounded-full border-2 border-yellow-500">
              {/* Body shine */}
              <div className="absolute top-1 left-2 w-3 h-3 bg-yellow-200 rounded-full opacity-80" />
              <div className="absolute top-0.5 left-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
            </div>

            {/* Duck head - simple circle */}
            <div className="absolute top-1 left-6 w-11 h-11 bg-yellow-400 rounded-full border-2 border-yellow-500">
              {/* Head shine */}
              <div className="absolute top-1 left-1.5 w-2.5 h-2.5 bg-yellow-200 rounded-full opacity-80" />

              {/* Eye - simple black dot */}
              <div className="absolute top-3 right-2.5 w-1.5 h-1.5 bg-black rounded-full">
                <div className="absolute top-0 left-0.5 w-0.5 h-0.5 bg-white rounded-full" />
              </div>

              {/* Beak - bigger triangle */}
              <div className="absolute top-4 -right-1 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-orange-500"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
