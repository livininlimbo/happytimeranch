// CenteredCarousel.tsx
import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  ReactNode,
} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Animated,
} from "react-native";

const GAP = 16;
const MIN_DESKTOP_WIDTH = 768;

type Props = {
  children: ReactNode;
  cardWidthPercentMobile?: number;
  maxCardWidthDesktop?: number;
  scrollInterval?: number;
};

export default function CenteredCarousel({
  children,
  cardWidthPercentMobile = 0.8,
  maxCardWidthDesktop = 320,
  scrollInterval = 3000,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollDivRef = useRef<HTMLDivElement | null>(null);
  const childDivRefs = useRef<Array<HTMLDivElement | null>>([]);

  const scrollViewRef = useRef<ScrollView | null>(null);

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const isWeb = Platform.OS === "web";
  const isMobileWeb = isWeb && screenWidth < MIN_DESKTOP_WIDTH;

  const childrenArray = React.Children.toArray(children);
  const totalCards = childrenArray.length;

  const scales = useRef<Animated.Value[]>(
    childrenArray.map((_, i) => new Animated.Value(i === currentIndex ? 1.3 : 1))
  ).current;

  useEffect(() => {
    scales.forEach((scale, i) => {
      Animated.timing(scale, {
        toValue: i === currentIndex ? 1.3 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [currentIndex, scales]);

  const cardScales = useRef<Animated.Value[]>(
    childrenArray.map((_, i) => new Animated.Value(i === currentIndex ? 1 : 0.9))
  ).current;

  useEffect(() => {
    cardScales.forEach((scale, i) => {
      Animated.timing(scale, {
        toValue: i === currentIndex ? 1 : 0.9,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [currentIndex, cardScales]);

  useLayoutEffect(() => {
    if (!isWeb) return;
    const measure = () => {
      let w = containerRef.current?.getBoundingClientRect().width ?? window.innerWidth;
      w = Math.floor(w);
      setContainerWidth(w);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isWeb]);

  const baseWidth = isWeb && containerWidth > 0 ? containerWidth : screenWidth;
  const isDesktop = baseWidth >= MIN_DESKTOP_WIDTH;

  const cardWidth = isDesktop
    ? Math.min(maxCardWidthDesktop, baseWidth / 5 - GAP)
    : Math.max(56, Math.round(baseWidth * cardWidthPercentMobile));

  const fullCardWidth = cardWidth + GAP;

  const totalCardsWithSpacers = totalCards + 2;

  useEffect(() => {
    if (totalCards <= 1) return;

    let id: number | null = null;

    const tick = () => {
      if ((isWeb && (!scrollDivRef.current || !containerRef.current)) || (!isWeb && !scrollViewRef.current)) {
        return;
      }
      const next = (currentIndexRef.current + 1) % totalCards;

      if (isWeb) {
        const scrollLeft = fullCardWidth * (next + 1);
        scrollDivRef.current!.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      } else {
        (scrollViewRef.current as any)?.scrollTo?.({
          x: Math.round(next * fullCardWidth),
          animated: true,
        });
      }

      setCurrentIndex(next);
    };

    id = window.setInterval(() => {
      if (isInteractingRef.current) return;
      tick();
    }, scrollInterval);

    return () => {
      if (id != null) window.clearInterval(id);
    };
  }, [totalCards, isWeb, fullCardWidth, scrollInterval]);

  const isInteractingRef = useRef(false);
  useEffect(() => {
    if (!isWeb) return;

    const el = scrollDivRef.current;
    if (!el) return;

    const handleDown = () => {
      if (isBouncingRef.current) return; // ignore if bounce running
      isInteractingRef.current = true;
    };
    const handleUp = () => {
      if (isBouncingRef.current) return;
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 120);
    };

    el.addEventListener("pointerdown", handleDown, { passive: true });
    el.addEventListener("touchstart", handleDown, { passive: true });
    el.addEventListener("pointerup", handleUp, { passive: true });
    el.addEventListener("touchend", handleUp, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", handleDown as any);
      el.removeEventListener("touchstart", handleDown as any);
      el.removeEventListener("pointerup", handleUp as any);
      el.removeEventListener("touchend", handleUp as any);
    };
  }, [isWeb, containerWidth]);

  // Bounce state to disable interaction during bounce
  const isBouncingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollLeftRef = useRef(0);
  const lastScrollTimestampRef = useRef(0);
  const pollingAnimationFrameRef = useRef<number | null>(null);

  const bounceBackIfNeeded = () => {
    if (!scrollDivRef.current) return;
    const el = scrollDivRef.current;
    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    const minScroll = fullCardWidth * 1 * 0.5;
    const maxScroll = maxScrollLeft - fullCardWidth * 1 * 0.5;

    if (scrollLeft < minScroll) {
      isBouncingRef.current = true;
      el.scrollTo({
        left: fullCardWidth * 1,
        behavior: "smooth",
      });
      setCurrentIndex(0);
      // Disable interaction briefly
      setTimeout(() => {
        isBouncingRef.current = false;
      }, 400);
    } else if (scrollLeft > maxScroll) {
      isBouncingRef.current = true;
      el.scrollTo({
        left: fullCardWidth * totalCards,
        behavior: "smooth",
      });
      setCurrentIndex(totalCards - 1);
      setTimeout(() => {
        isBouncingRef.current = false;
      }, 400);
    }
  };

  const pollScrollPosition = () => {
    if (!scrollDivRef.current) return;
    const el = scrollDivRef.current;
    let lastPos = el.scrollLeft;

    const checkPosition = () => {
      if (!scrollDivRef.current) return;
      const currentPos = scrollDivRef.current.scrollLeft;
      if (Math.abs(currentPos - lastPos) < 0.5) {
        // Scroll position settled, do bounce-back
        bounceBackIfNeeded();
        pollingAnimationFrameRef.current = null;
      } else {
        lastPos = currentPos;
        pollingAnimationFrameRef.current = requestAnimationFrame(checkPosition);
      }
    };
    pollingAnimationFrameRef.current = requestAnimationFrame(checkPosition);
  };

  const handleScroll = (e: any) => {
    if (!scrollDivRef.current) return;
    const el = scrollDivRef.current;

    const left = el.scrollLeft;
    const now = performance.now();

    const delta = left - lastScrollLeftRef.current;
    const dt = now - lastScrollTimestampRef.current || 16;
    const velocity = Math.abs(delta / dt);

    lastScrollLeftRef.current = left;
    lastScrollTimestampRef.current = now;

    const rawIndex = (left - fullCardWidth) / fullCardWidth;
    const idx = Math.min(totalCards - 1, Math.max(0, Math.round(rawIndex)));
    if (idx !== currentIndex) setCurrentIndex(idx);

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    // Gradual debounce delay based on velocity
    const maxDebounce = 700;
    const minDebounce = 150;
    const debounceDelay = Math.min(maxDebounce, minDebounce + velocity * 500);

    scrollTimeoutRef.current = window.setTimeout(() => {
      pollScrollPosition();
    }, debounceDelay);
  };

  // Render web mobile
  if (isWeb && !isDesktop) {
    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: 1400,
          boxSizing: "border-box",
          paddingTop: GAP,
          paddingBottom: GAP,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          ref={scrollDivRef}
          onScroll={handleScroll as any}
          style={{
            width: "100%",
            height: 280,
            overflowX: "auto",
            overflowY: "hidden",
            display: "flex",
            gap: `${GAP}px`,
            paddingLeft: 0,
            paddingRight: 0,
            alignItems: "center",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x",
            scrollbarWidth: "none",
            // Optionally add overscrollBehaviorX to contain rubber band:
            overscrollBehaviorX: "contain",
          }}
        >
          {/* Left spacer */}
          <div
            style={{
              flex: "0 0 auto",
              width: cardWidth,
              height: 265,
              pointerEvents: "none",
              userSelect: "none",
              opacity: 0,
            }}
          />
          {childrenArray.map((child, i) => (
            <div
              key={i}
              ref={(el) => (childDivRefs.current[i] = el)}
              style={{
                flex: "0 0 auto",
                width: `${cardWidth}px`,
                height: 265,
                borderRadius: 12,
                overflow: "hidden",
                scrollSnapAlign: "center",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                  overflow: "hidden",
                  transformOrigin: "center center",
                  transform: i === currentIndex ? "scale(1)" : "scale(0.9)",
                  transition: "transform 0.3s ease",
                }}
              >
                {child}
              </div>
            </div>
          ))}
          {/* Right spacer */}
          <div
            style={{
              flex: "0 0 auto",
              width: cardWidth,
              height: 265,
              pointerEvents: "none",
              userSelect: "none",
              opacity: 0,
            }}
          />
        </div>
        {/* pagination dots */}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {childrenArray.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === currentIndex ? "#fff" : "#ccccccaa",
                transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
                transition: "transform 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop render (no pagination dots)
  if (isDesktop) {
    const containerWidth = cardWidth * 5 + GAP * 10;
    return (
      <View style={styles.desktopWrapper}>
        <View style={[styles.desktopContainer, { width: containerWidth }]}>
          {childrenArray.map((child, index) => (
            <View
              key={index}
              style={[styles.desktopCard, { width: cardWidth, margin: GAP / 2 }]}
            >
              {child}
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Native mobile
  return (
    <View style={styles.mobileWrapper}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={fullCardWidth}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={handleScroll as any}
        contentContainerStyle={{
          paddingLeft: GAP / 2 + GAP * 1.5,
          paddingRight: GAP / 2 + GAP * 1.5,
          alignItems: "center",
        }}
        style={{ touchAction: "pan-x" }}
      >
        {childrenArray.map((child, i) => (
          <View
            key={i}
            style={{
              width: cardWidth,
              marginHorizontal: GAP / 2,
              borderRadius: 12,
              overflow: "hidden",
              height: 265,
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale: cardScales[i] }],
                height: "100%",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {child}
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {childrenArray.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? "#ffffff" : "#ccccccaa",
                transform: [{ scale: scales[index] }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: GAP,
  },
  desktopContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 1400,
    gap: GAP,
  },
  desktopCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  mobileWrapper: {
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
