import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const SectionCarousel = ({ children, settings = {}, isEditing }) => {
    const {
        slidesPerView = 3,
        showDots = true,
        showArrows = true,
        autoplay = false,
        autoplaySpeed = 3000
    } = settings;

    // Convert children to array to map them into SwiperSlides
    const childrenArray = React.Children.toArray(children);

    // Custom navigation refs
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [paginationEl, setPaginationEl] = useState(null);

    return (
        <div className={`section-carousel relative group`}>
            {/* Custom Navigation Buttons */}
            {showArrows && (
                <>
                    <button
                        ref={prevRef}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-20 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ marginLeft: '-1rem' }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        ref={nextRef}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-20 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ marginRight: '-1rem' }}
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                slidesPerGroup={1}
                breakpoints={{
                    640: {
                        slidesPerView: Math.min(2, slidesPerView),
                        slidesPerGroup: Math.min(2, slidesPerView),
                    },
                    1024: {
                        slidesPerView: slidesPerView,
                        slidesPerGroup: slidesPerView,
                    },
                }}
                pagination={showDots && paginationEl ? { clickable: true, el: paginationEl } : false}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                autoplay={autoplay && !isEditing ? { delay: autoplaySpeed, disableOnInteraction: false } : false}
                allowTouchMove={!isEditing}
                simulateTouch={!isEditing}
                className="w-full px-1"
            >
                {childrenArray.map((child, index) => (
                    <SwiperSlide key={index} className="h-auto">
                        <div className="h-full">
                            {child}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* External Pagination Container */}
            <div className="flex justify-center mt-8 pb-2" ref={setPaginationEl}></div>

            {isEditing && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded z-10 font-bold opacity-50 pointer-events-none">
                    Carousel Mode
                </div>
            )}

            <style jsx global>{`
                .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: #cbd5e1;
                    opacity: 1;
                    transition: all 0.3s;
                }
                .swiper-pagination-bullet-active {
                    background: #2563eb;
                    width: 24px;
                    border-radius: 5px;
                }
            `}</style>
        </div>
    );
};

export default SectionCarousel;
