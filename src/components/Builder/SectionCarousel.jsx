import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

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

    return (
        <div className={`section-carousel relative`}>
            <style jsx global>{`
                .swiper-button-next, .swiper-button-prev {
                    color: #2563eb; 
                    background: white; 
                    width: 32px; 
                    height: 32px; 
                    border-radius: 50%;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    z-index: 20;
                    opacity: 0;
                    transform: scale(0.5);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .section-carousel:hover .swiper-button-next,
                .section-carousel:hover .swiper-button-prev {
                    opacity: 1;
                    transform: scale(1);
                }
                .swiper-button-next::after, .swiper-button-prev::after {
                    font-size: 12px;
                    line-height: 1;
                }
                .swiper-pagination-bullet-active {
                    background: #2563eb;
                }
            `}</style>

            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                    640: {
                        slidesPerView: Math.min(2, slidesPerView),
                    },
                    1024: {
                        slidesPerView: slidesPerView,
                    },
                }}
                pagination={showDots ? { clickable: true } : false}
                navigation={showArrows}
                autoplay={autoplay && !isEditing ? { delay: autoplaySpeed, disableOnInteraction: false } : false}
                allowTouchMove={!isEditing}
                simulateTouch={!isEditing}
                className="w-full pb-12 px-1"
            >
                {childrenArray.map((child, index) => (
                    <SwiperSlide key={index} className="h-auto">
                        <div className="h-full">
                            {child}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {isEditing && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded z-10 font-bold opacity-80 pointer-events-none">
                    Carousel Mode
                </div>
            )}
        </div>
    );
};

export default SectionCarousel;
