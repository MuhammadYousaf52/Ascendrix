'use client';
import HTMLFlipBook from 'react-pageflip';
import React, { useEffect, useRef, useState } from 'react';
import '@/app/styles/MyBook.css';

const chapters = [
    {
        number: 'Chapter I',
        title: 'The Beginning',
        content: 'Two years ago, Adan and Joshua were deep in the trenches of Amazon account management, pulling reports at midnight, running ads, rebuilding listings. The brands they managed were hitting record revenue, dashboards looked phenomenal on the surface. But every time they dug into the actual net profit numbers, the story was completely different.'
    },
    {
        number: 'Chapter II',
        title: 'The Problem',
        content: 'Higher revenue, same bank account. More ad spend, fewer real dollars kept. Amazon fees kept climbing. CPCs kept climbing. Competition kept climbing. Brands were running faster just to stand still. The entire industry was optimizing for the wrong metric, everyone was chasing sales, nobody was protecting profit.'
    },
    {
        number: 'Chapter III',
        title: 'The Breakthrough',
        content: 'They stopped asking how to get more sales and started asking how to keep more of every dollar already being earned. That shift became the Profit Protocol System, a five-stage framework that fixes the leaks before scaling what is working.'
    },
    {
        number: 'Chapter IV',
        title: 'The Agency',
        content: 'What started as informal advice quickly turned into a dedicated agency. Today, Ascendrix has helped seventeen brands across supplements, beauty, jewelry, and pet health, generating over twenty-one million in traceable sales with a success rate in hitting the profit target inside eighty-2 days.'
    },
];

const CoverPage = React.forwardRef((props, ref) => (
    <div ref={ref} className="book-page book-cover">
        <div className="book-corner book-corner-tl">╔</div>
        <div className="book-corner book-corner-tr">╔</div>
        <div className="book-corner book-corner-bl">╔</div>
        <div className="book-corner book-corner-br">╔</div>
        <div className="book-cover-inner-border" />
        <div className="book-cover-inner">
            <div className="book-cover-top-line" />
            <img src="/Logo.png" alt="Ascendrix" className="book-cover-logo" />
            <h1 className="book-cover-title">Ascendrix</h1>
            <div className="book-cover-divider">
                <div className="book-cover-divider-line" />
                <span className="book-cover-divider-diamond">♦</span>
                <div className="book-cover-divider-line" />
            </div>
            <p className="book-cover-subtitle">The Chronicle of How We Forged<br />Revenue Into Lasting Wealth</p>
            <div className="book-cover-ornament">✥</div>
            <div className="book-cover-bottom-line" />
        </div>
    </div>
));
CoverPage.displayName = 'CoverPage';

const ChapterPage = React.forwardRef((props, ref) => (
    <div ref={ref} className="book-page book-chapter-page">
        <div className="book-chapter-inner">
            <div className="book-chapter-flourish">❦</div>
            <div className="book-chapter-number">{props.chapter.number}</div>
            <div className="book-chapter-divider" />
            <h2 className="book-chapter-title">{props.chapter.title}</h2>
            <div className="book-chapter-subtitle-line">
                <div className="book-chapter-subtitle-rule" />
                <span className="book-chapter-subtitle-star">✦</span>
                <div className="book-chapter-subtitle-rule" />
            </div>
        </div>
    </div>
));
ChapterPage.displayName = 'ChapterPage';

const ContentPage = React.forwardRef((props, ref) => (
    <div ref={ref} className="book-page book-content-page">
        <div className="book-content-inner">
            <div className="book-content-header">
                <span className="book-content-header-ornament">❦ ❦ ❦</span>
            </div>
            <p className="book-content-text">{props.chapter.content}</p>
            <div className="book-content-footer">
                <span className="book-page-footer-ornament">✻</span>
                <div className="book-page-number">{props.pageNum}</div>
                <span className="book-page-footer-ornament">✻</span>
            </div>
        </div>
    </div>
));
ContentPage.displayName = 'ContentPage';

const BackCoverPage = React.forwardRef((props, ref) => (
    <div ref={ref} className="book-page book-back-cover">
        <div className="book-cover-inner">
            <div className="book-cover-ornament">✥</div>
            <p className="book-back-quote">"We do not merely run advertisements.<br />We safeguard your prosperity."</p>
            <div className="book-cover-divider">
                <div className="book-cover-divider-line" />
                <span className="book-cover-divider-diamond">♦</span>
                <div className="book-cover-divider-line" />
            </div>
            <p className="book-cover-subtitle">— Ascendrix —</p>
            <div className="book-cover-ornament">✥</div>
        </div>
    </div>
));
BackCoverPage.displayName = 'BackCoverPage';

export default function MyBook() {
    const bookRef = useRef(null);
    const containerRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const [dimensions, setDimensions] = useState({
        bookWidth: 431,
        bookHeight: 575,
        tableWidth: 863,
        tableOffsetX: -92,
        contentScale: 1,
        marginTop: '32px',
        padding: '40px 0',
        showTable: true,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const updateDimensions = () => {
            const width = window.innerWidth;
            
            if (width < 375) {
                setDimensions({
                    bookWidth: 160,
                    bookHeight: 220,
                    tableWidth: 320,
                    tableOffsetX: 0,
                    contentScale: 0.52,
                    marginTop: '12px',
                    padding: '16px 8px',
                    showTable: false,
                });
            } else if (width >= 375 && width < 430) {
                setDimensions({
                    bookWidth: 180,
                    bookHeight: 245,
                    tableWidth: 360,
                    tableOffsetX: 0,
                    contentScale: 0.58,
                    marginTop: '14px',
                    padding: '20px 8px',
                    showTable: false,
                });
            } else if (width >= 430 && width < 480) {
                setDimensions({
                    bookWidth: 205,
                    bookHeight: 280,
                    tableWidth: 410,
                    tableOffsetX: 0,
                    contentScale: 0.64,
                    marginTop: '16px',
                    padding: '24px 8px',
                    showTable: false,
                });
            } else if (width >= 480 && width < 600) {
                setDimensions({
                    bookWidth: 230,
                    bookHeight: 310,
                    tableWidth: 460,
                    tableOffsetX: 0,
                    contentScale: 0.70,
                    marginTop: '18px',
                    padding: '24px 12px',
                    showTable: false,
                });
            } else if (width >= 600 && width < 768) {
                setDimensions({
                    bookWidth: 280,
                    bookHeight: 380,
                    tableWidth: 560,
                    tableOffsetX: 0,
                    contentScale: 0.80,
                    marginTop: '20px',
                    padding: '28px 12px',
                    showTable: false,
                });
            } else if (width >= 768 && width < 912) {
                setDimensions({
                    bookWidth: 340,
                    bookHeight: 460,
                    tableWidth: 680,
                    tableOffsetX: 0,
                    contentScale: 0.90,
                    marginTop: '24px',
                    padding: '32px 16px',
                    showTable: false,
                });
            } else if (width >= 912 && width < 1024) {
                setDimensions({
                    bookWidth: 380,
                    bookHeight: 510,
                    tableWidth: 760,
                    tableOffsetX: 0,
                    contentScale: 0.95,
                    marginTop: '26px',
                    padding: '36px 16px',
                    showTable: false,
                });
            } else if (width >= 1024 && width < 1280) {
                setDimensions({
                    bookWidth: 320,
                    bookHeight: 427,
                    tableWidth: 640,
                    tableOffsetX: -32,
                    contentScale: 0.95,
                    marginTop: '26px',
                    padding: '32px 0',
                    showTable: true,
                });
            } else {
                setDimensions({
                    bookWidth: 380,
                    bookHeight: 507,
                    tableWidth: 760,
                    tableOffsetX: -80,
                    contentScale: 0.95,
                    marginTop: '32px',
                    padding: '40px 0',
                    showTable: true,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [mounted]);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                try {
                    if (bookRef.current && bookRef.current.pageFlip) {
                        const flipObj = bookRef.current.pageFlip();

                        if (flipObj && typeof flipObj.getCurrentPageIndex === 'function') {
                            const currentPage = flipObj.getCurrentPageIndex();
                            const totalPages = flipObj.getPageCount?.() || 8;
                            
                            if (entry.isIntersecting) {
                                if (currentPage === 0) {
                                    // Detect if device is mobile based on showTable flag
                                    const delayTime = dimensions.showTable ? 2500 : 1300;
                                    
                                    setTimeout(() => {
                                        try {
                                            const fp = bookRef.current?.pageFlip();
                                            if (fp && typeof fp.getCurrentPageIndex === 'function' && fp.getCurrentPageIndex() === 0) {
                                                fp.flip(1);
                                            }
                                        } catch (e) {
                                            // Ignore errors
                                        }
                                    }, delayTime);
                                }
                            } else {
                                if (currentPage > 0 && currentPage < totalPages) {
                                    flipObj.turnToPage(0);
                                }
                            }
                        }
                    }
                } catch (error) {
                    // Silently ignore errors during scroll
                }
            },
            { threshold: 0.15 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [dimensions.showTable]);

    return (
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%', overflow: 'hidden' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: dimensions.padding, width: '100%', maxWidth: dimensions.showTable ? `${dimensions.tableWidth + 120}px` : '100vw', margin: '0 auto' }}>
                {/* Table - Only rendered if showTable is true */}
                {dimensions.showTable && (
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, #2e2a24 0%, #3a352e 40%, #2e2a24 100%)',
                        backgroundImage: 'linear-gradient(180deg, #2e2a24 0%, #3a352e 40%, #2e2a24 100%), repeating-linear-gradient(90deg, transparent 0px, transparent 18px, rgba(139, 100, 50, 0.1) 18px, rgba(139, 100, 50, 0.1) 20px)',
                        borderTop: '2px solid #8b7355',
                        borderBottom: '6px solid #1a1613',
                        borderLeft: '3px solid #544a3d',
                        borderRight: '3px solid #544a3d',
                        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.7), inset 0 2px 6px rgba(214, 184, 150, 0.1), inset 0 -2px 6px rgba(0, 0, 0, 0.5)',
                        borderRadius: '18px',
                        zIndex: 0,
                    }} />
                )}
                {/* Book container */}
                <div className="book-flipbook-container" style={{ position: 'relative', zIndex: 1, width: `${dimensions.tableWidth}px`, maxWidth: '100%', display: 'flex', justifyContent: 'center', '--content-scale': dimensions.contentScale }}>
                    <HTMLFlipBook
                        ref={bookRef}
                        width={dimensions.bookWidth}
                        height={dimensions.bookHeight}
                        size="fixed"
                        showCover={true}
                        mobileScrollSupport={true}
                        flippingTime={900}
                        usePortrait={false}
                        drawShadow={false}
                        className="book-flipbook"
                    >
                        <CoverPage />
                        {chapters.map((chapter, i) => [
                            <ChapterPage key={`ch-${i}`} chapter={chapter} />,
                            <ContentPage key={`co-${i}`} chapter={chapter} pageNum={i * 2 + 2} />
                        ])}
                        <BackCoverPage />
                    </HTMLFlipBook>
                </div>
            </div>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: `${Math.max(10, parseFloat(dimensions.contentScale) * 11)}px`, color: '#8b6914', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: dimensions.marginTop, position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 16px' }}>✦ Click the page to continue reading ✦</p>
        </div>
    );
}