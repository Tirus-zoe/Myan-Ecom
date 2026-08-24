import React, { useState, useEffect, useRef } from 'react';
import { PromoBanner } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getTheme } from '../../utils/theme';

export const HomeBannerSlider: React.FC = () => {
  const { banners, setActiveCategory, shopInfo } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const theme = getTheme(shopInfo.themeColor);

  // Swipe / Drag state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const minSwipeDistance = 45; // in px

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  if (!banners.length) return null;

  const currentBanner = banners[currentIndex];

  const handleBannerClick = (banner: PromoBanner) => {
    // If was dragging significantly, prevent navigation
    if (touchStartX.current !== null && touchEndX.current !== null) {
      if (Math.abs(touchStartX.current - touchEndX.current) > 10) {
        return;
      }
    }
    if (banner.linkCategoryId) {
      setActiveCategory(banner.linkCategoryId);
      navigate('/categories');
    }
  };

  // Touch Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Mouse Drag Handlers for Desktop
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const onMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsPaused(false);
      if (touchStartX.current !== null && touchEndX.current !== null) {
        const distance = touchStartX.current - touchEndX.current;
        if (distance > minSwipeDistance) {
          nextSlide();
        } else if (distance < -minSwipeDistance) {
          prevSlide();
        }
      }
    }
  };

  const onMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsPaused(false);
    }
  };

  return (
    <div
      id="promo-banner-slider"
      className="relative w-full overflow-hidden rounded-3xl shadow-sm my-3 select-none group touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div
        onClick={() => handleBannerClick(currentBanner)}
        className="relative w-full h-44 sm:h-52 cursor-pointer overflow-hidden rounded-3xl"
      >
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
          <div className={`flex items-center gap-1.5 w-fit mb-1.5 px-2.5 py-0.5 rounded-full ${theme.badgeBg} backdrop-blur-md text-[10px] font-extrabold tracking-wider uppercase shadow-sm`}>
            <Sparkles size={11} />
            <span>{currentBanner.badge}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold leading-snug line-clamp-1 drop-shadow-md">
            {currentBanner.title}
          </h2>
          <p className="text-xs text-gray-200 line-clamp-1 mt-0.5 drop-shadow">
            {currentBanner.subtitle}
          </p>
        </div>
      </div>

      {/* Swipe Nav Arrow Controls (Visible on hover & desktop) */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
            aria-label="Next Slide"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Slide Navigation Indicator Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
