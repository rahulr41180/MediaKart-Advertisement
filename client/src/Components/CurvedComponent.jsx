
import React, { useState, useEffect, useRef } from 'react';
import "../CSS/CurvedComponent.css"

export const CurvedComponent = () => {
    const [pathData, setPathData] = useState("M0 145 C 80 130, 5 145, 140 120 S 500 60, 960 145");
    const [secondPathData, setSecondPathData] = useState("M0 155 C 210 120, 80 145, 190 125 S 500 35, 960 150");
    const [scrollPosition, setScrollPosition] = useState(0);
    const [rotation, setRotation] = useState(0);
    const pathRef = useRef(null);
    const [angle, setAngle] = useState(0);
    const [prevScrollPosition, setPrevScrollPosition] = useState(0);
    const [traveledLength, setTraveledLength] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [showText1, setShowText1] = useState(false);
    const [showText2, setShowText2] = useState(false);

    useEffect(() => {
        // Set initial angle based on the starting point of the path
        if (pathRef.current) {
            const point1 = pathRef.current.getPointAtLength(0);
            const point2 = pathRef.current.getPointAtLength(1);
            const dx = point2.x - point1.x;
            const dy = point2.y - point1.y;
            const initialAngle = Math.atan2(dy, dx) * (180 / Math.PI);
            setAngle(initialAngle);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const newPosition = window.scrollY;

            if (newPosition > prevScrollPosition) {
                // Scrolling down
                setScrollPosition(newPosition);

                if (pathRef.current) {
                    const pathLength = pathRef.current.getTotalLength();
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    const maxScrollLimit = maxScroll * 0.50;
                    let currentLength = traveledLength + ((newPosition - prevScrollPosition) / maxScroll) * pathLength;

                    if (currentLength > 0.50 * pathLength) {
                        currentLength = 0.50 * pathLength;
                        setIsMoving(false); 
                        setRotation(0); 
                    } else {
                        setIsMoving(true); 
                    }

                    setTraveledLength(currentLength);

                    // Calculate angle dynamically up to 50% of the path length
                    const point1 = pathRef.current.getPointAtLength(currentLength - 1);
                    const point2 = pathRef.current.getPointAtLength(currentLength + 1);
                    const dx = point2.x - point1.x;
                    const dy = point2.y - point1.y;
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    setAngle(angle);

                    // Determine visibility of text1 and text2 based on traveled length
                    const text1Threshold = 0.25 * pathLength;
                    const text2Threshold = 0.40 * pathLength;

                    if (currentLength >= text1Threshold && currentLength < text2Threshold) {
                        setShowText1(true);
                        setShowText2(false);
                    } else if (currentLength >= text2Threshold) {
                        setShowText1(false);
                        setShowText2(true);
                    } else {
                        setShowText1(false);
                        setShowText2(false);
                    }

                    // Update rotation based on scroll position, stop at 55% scroll
                    if (newPosition <= maxScrollLimit) {
                        const maxRotation = 360; // 360 degrees for a full rotation
                        const rotation = (newPosition / maxScrollLimit) * maxRotation;
                        setRotation(rotation);
                    }
                }
            } else if (newPosition < prevScrollPosition) {
                // Scrolling up
                setScrollPosition(newPosition);
                setIsMoving(false);
                setRotation(0);
            }

            // Update previous scroll position
            setPrevScrollPosition(newPosition);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPosition, traveledLength]);

    const getPointAtScroll = () => {
        if (pathRef.current) {
            const pathLength = pathRef.current.getTotalLength();
            let currentLength = traveledLength;

            const point = pathRef.current.getPointAtLength(currentLength);
            return point;
        }
        return { x: 0, y: 0 };
    };

    const point = getPointAtScroll();

    return (
        <>
            <svg width="960" height="150" className="curved_svg">
                <defs>
                    <pattern id="image" x="0" y="0" patternUnits="userSpaceOnUse" width="100%" height="100%">
                        <image href="https://c.gumgum.com/ads/com/ford/ford_summer_sales_event_19/suv/scroll/00/scroll.hyperesources/BG-450.png" width="100%" height="100%" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#image)" />
                <path
                    d={pathData}
                    stroke=""
                    fill="transparent"
                    ref={pathRef}
                />
                <path
                    d={secondPathData}
                    stroke="black"
                    fill="transparent"
                />
            </svg>
            <div className="car_container"
                style={{
                    transform: `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`,
                    transition: isMoving ? 'transform 0.1s' : 'none', // Apply transition only when moving
                }}
            >
                <img className="car_image" src="https://c.gumgum.com/ads/com/ford/ford_summer_sales_event_19/suv/scroll/00/scroll.hyperesources/IMG_SUV.png" alt="" />
                <img className="car_wheel1_img" src="https://c.gumgum.com/ads/com/ford/ford_summer_sales_event_19/suv/scroll/00/scroll.hyperesources/IMG_SUV-L.png" alt="" style={{
                    transform: isMoving ? `rotate(${rotation}deg)` : 'rotate(0deg)',
                    transition: isMoving ? 'transform 0.1s' : 'none' // Apply transition only when moving
                }} />
                <img className="car_wheel2_img" src="https://c.gumgum.com/ads/com/ford/ford_summer_sales_event_19/suv/scroll/00/scroll.hyperesources/IMG_SUV-L.png" alt="" style={{
                    transform: isMoving ? `rotate(${rotation}deg)` : 'rotate(0deg)',
                    transition: isMoving ? 'transform 0.1s' : 'none' // Apply transition only when moving
                }} />
            </div>
            {showText1 && (
                <div className="curved_txt1">
                    <div>SWEET DEALS AND SUMMER.</div>
                </div>
            )}
            {showText2 && (
                <div className="curved_txt2">
                    <div>THEY DON'T LAST LONG.</div>
                </div>
            )}
        </>
    );
};