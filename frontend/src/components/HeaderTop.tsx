import React, { useState, useEffect } from "react";

const HeaderTop: React.FC = () => {
const announcements = [
    "Free 2-Day Shipping & Easy Returns",
    "Discover Our Latest Greeting Card Designs"
];
const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
const [isVisible, setIsVisible] = useState(true);

useEffect(() => {
        const interval = setInterval(() => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
            setIsVisible(true);
        }, 500); // Wait for fade out before changing text
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [announcements.length]);

    const nextAnnouncement = () => {
        setIsVisible(false);
        setTimeout(() => {
        setCurrentAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        setIsVisible(true);
        }, 500);
    };

    const prevAnnouncement = () => {
        setIsVisible(false);
        setTimeout(() => {
        setCurrentAnnouncementIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length);
        setIsVisible(true);
        }, 500);
    };

    return (
        <aside className="sticky top-0 z-20" style={{ backgroundColor: 'rgb(0, 0, 90)', color: 'rgb(255, 255, 255)' }}>
        <div className="container">
            <div className="flex justify-center items-center h-10 relative">
            <button className="relative left-2 tap-area p-1" onClick={prevAnnouncement} aria-label="Previous">
                <svg role="presentation" focusable="false" width="7" height="10" className="icon icon-chevron-left reverse-icon" viewBox="0 0 7 10">
                <path d="M6 1 2 5l4 4" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
            </button>
            <div className="announcement-bar__static-list overflow-hidden px-8">
                <p 
                className={`bold text-xs transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ whiteSpace: 'nowrap' }}
                >
                {announcements[currentAnnouncementIndex]}
                </p>
            </div>
            <button className="relative right-2 tap-area p-1" onClick={nextAnnouncement} aria-label="Next">
                <svg role="presentation" focusable="false" width="7" height="10" className="icon icon-chevron-right reverse-icon" viewBox="0 0 7 10">
                <path d="m1 9 4-4-4-4" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
            </button>
            </div>
        </div>
        </aside>
    );
};

export default HeaderTop;