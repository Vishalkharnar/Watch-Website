/* ==========================================================================
   MILLE-X LUXURY HOMEPAGE — INTERACTIVE LOGIC
   Fully responsive: Mobile (320px+) | Tablet (768px+) | Laptop (1024px+) | Desktop (1440px+)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------------------------
       UTILITY: detect touch/mobile
    ----------------------------------------------------------------------- */
    const isTouchDevice = () => window.matchMedia("(hover: none)").matches;
    const isMobile      = () => window.innerWidth < 768;
    const isTablet      = () => window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop     = () => window.innerWidth >= 1024;

    /* -----------------------------------------------------------------------
       GSAP — register plugin with graceful fallback
    ----------------------------------------------------------------------- */
    const hasGSAP = typeof gsap !== "undefined";
    if (hasGSAP) {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.warn("GSAP not loaded — CSS/IntersectionObserver fallbacks active.");
    }



    /* ═══════════════════════════════════════════════════════════════════════
       2B. HERO CAROUSEL - GSAP Scroll-Triggered Slide Animations
    ═══════════════════════════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════════════════════════
       2B. HERO CAROUSEL - GSAP Pinned Slide Swipe Down to Up Transitions
    ═══════════════════════════════════════════════════════════════════════ */
    const heroCarousel = document.getElementById("hero-carousel");
    const heroSlides = document.querySelectorAll(".hero-slide");

    if (heroCarousel && heroSlides.length > 0 && hasGSAP) {
        // Add class to enable absolute stack positioning in CSS
        heroCarousel.classList.add("swipe-mode");

        // Initial entrance animation for Slide 1 content on page load
        const slide1 = heroSlides[0];
        const badge1 = slide1.querySelector(".hero-badge");
        const title1 = slide1.querySelector(".hero-title");
        const desc1 = slide1.querySelector(".hero-description");
        const actions1 = slide1.querySelector(".hero-actions");

        const entranceTL = gsap.timeline({ delay: 0.2 });
        if (badge1) entranceTL.from(badge1, { opacity: 0, y: 30, duration: 0.6, ease: "power2.out" });
        if (title1) entranceTL.from(title1, { opacity: 0, y: 40, duration: 0.8, ease: "power2.out" }, "-=0.4");
        if (desc1) entranceTL.from(desc1, { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" }, "-=0.5");
        if (actions1) entranceTL.from(actions1, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.5");

        // Create the main pinned scroll swipe timeline
        const heroTL = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: () => `+=${window.innerHeight * (heroSlides.length - 1)}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        // Set initial stack properties for subsequent slides
        heroSlides.forEach((slide, index) => {
            if (index > 0) {
                gsap.set(slide, { yPercent: 100, zIndex: index + 1 });
            }
        });

        // Loop through subsequent slides and orchestrate card stack animations
        heroSlides.forEach((slide, index) => {
            if (index > 0) {
                const badge = slide.querySelector(".hero-badge");
                const title = slide.querySelector(".hero-title");
                const desc = slide.querySelector(".hero-description");
                const actions = slide.querySelector(".hero-actions");
                const bg = slide.querySelector(".hero-slide-background");

                // Slide in the next card from bottom to top (yPercent: 100 to 0)
                heroTL.to(slide, {
                    yPercent: 0,
                    ease: "power2.inOut",
                    duration: 1.2
                });

                // Parallax shift for slide backgrounds
                if (bg) {
                    heroTL.fromTo(bg, 
                        { yPercent: -15, scale: 1.1 },
                        { yPercent: 0, scale: 1.05, ease: "none", duration: 1.2 },
                        "-=1.2"
                    );
                }

                // Staggered fade and slide entries for text elements
                if (badge) {
                    heroTL.fromTo(badge, 
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                        "-=0.8"
                    );
                }
                if (title) {
                    heroTL.fromTo(title,
                        { opacity: 0, y: 50 },
                        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
                        "-=0.6"
                    );
                }
                if (desc) {
                    heroTL.fromTo(desc,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
                        "-=0.5"
                    );
                }
                if (actions) {
                    heroTL.fromTo(actions,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                        "-=0.4"
                    );
                }
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       3. SMOOTH SCROLL FOR NAV LINKS
    ═══════════════════════════════════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            const headerHeight = document.getElementById("header")?.offsetHeight || 70;
            const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetY, behavior: "smooth" });
        });
    });


    /* ═══════════════════════════════════════════════════════════════════════
       4. STICKY HEADER + ACTIVE NAV LINKS
    ═══════════════════════════════════════════════════════════════════════ */
    const header   = document.getElementById("header");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Scrolled class
                header.classList.toggle("scrolled", window.scrollY > 50);

                // Active link
                let currentId = "";
                sections.forEach(sec => {
                    if (window.scrollY >= sec.offsetTop - 130) {
                        currentId = sec.id;
                    }
                });
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
                });

                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener("scroll", onScroll, { passive: true });


    /* ═══════════════════════════════════════════════════════════════════════
       5. MOBILE HAMBURGER MENU
    ═══════════════════════════════════════════════════════════════════════ */
    const hamburger    = document.getElementById("hamburger-btn");
    const mobileOverlay = document.getElementById("mobile-menu-overlay");

    if (hamburger && mobileOverlay) {
        hamburger.addEventListener("click", () => {
            const isOpen = mobileOverlay.classList.toggle("open");
            hamburger.classList.toggle("active", isOpen);
            // Prevent body scroll when menu open
            document.body.style.overflow = isOpen ? "hidden" : "";
        });

        mobileOverlay.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                mobileOverlay.classList.remove("open");
                hamburger.classList.remove("active");
                document.body.style.overflow = "";
            });
        });

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mobileOverlay.classList.contains("open")) {
                mobileOverlay.classList.remove("open");
                hamburger.classList.remove("active");
                document.body.style.overflow = "";
            }
        });
    }


    /* ═══════════════════════════════════════════════════════════════════════
       6. SEARCH MODAL OVERLAY
    ═══════════════════════════════════════════════════════════════════════ */
    const searchBtn     = document.getElementById("search-btn");
    const closeSearchBtn = document.getElementById("close-search");
    const searchOverlay = document.getElementById("search-overlay");

    if (searchBtn && closeSearchBtn && searchOverlay) {
        const openSearch = () => {
            searchOverlay.classList.add("open");
            document.body.style.overflow = "hidden";
            setTimeout(() => document.getElementById("search-input")?.focus(), 250);
        };

        const closeSearch = () => {
            searchOverlay.classList.remove("open");
            document.body.style.overflow = "";
        };

        searchBtn.addEventListener("click", openSearch);
        closeSearchBtn.addEventListener("click", closeSearch);

        // Close on Escape or clicking backdrop
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && searchOverlay.classList.contains("open")) closeSearch();
        });

        searchOverlay.addEventListener("click", (e) => {
            if (e.target === searchOverlay) closeSearch();
        });
    }


    /* ═══════════════════════════════════════════════════════════════════════
       7. DARK / LIGHT THEME SWITCHER
    ═══════════════════════════════════════════════════════════════════════ */
    const themeToggle = document.getElementById("theme-toggle");

    // Restore saved theme immediately (already done via inline attr if set, this is JS fallback)
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current  = document.documentElement.getAttribute("data-theme");
            const newTheme = current === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            if (hasGSAP) {
                gsap.fromTo("body", { opacity: 0.88 }, { opacity: 1, duration: 0.35 });
            }
        });
    }


    /* ═══════════════════════════════════════════════════════════════════════
       8. HERO WATCH — MOUSE PARALLAX TILT  (desktop only)
    ═══════════════════════════════════════════════════════════════════════ */
    const heroSection = document.getElementById("hero");
    const heroWatch   = document.querySelector(".hero-bg-img");

    if (heroSection && heroWatch && !isTouchDevice()) {
        heroSection.addEventListener("mousemove", (e) => {
            const rect  = heroSection.getBoundingClientRect();
            const x     = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y     = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            // Parallax panning effect
            heroWatch.style.transform = `scale(1.05) translate(${x * -15}px, ${y * -15}px)`;
        });

        heroSection.addEventListener("mouseleave", () => {
            heroWatch.style.transform = "scale(1.05) translate(0px, 0px)";
        });
    }


    /* ═══════════════════════════════════════════════════════════════════════
       9. EXPLODED WATCH VIEWER — GSAP SCROLL PARALLAX FOR 4 ROWS
    ═══════════════════════════════════════════════════════════════════════ */
    const explodedRows = document.querySelectorAll(".exploded-row");
    if (explodedRows.length > 0 && hasGSAP) {
        explodedRows.forEach((row) => {
            // Parallax scroll effect for each row image
            const img = row.querySelector(".exploded-parallax-img");
            if (img) {
                gsap.fromTo(
                    img,
                    { yPercent: -12 },
                    {
                        yPercent: 12,
                        ease: "none",
                        scrollTrigger: {
                            trigger: row,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            }

            // Slide-up fade-in transition for the description content block
            const content = row.querySelector(".exploded-content-col");
            if (content) {
                gsap.fromTo(
                    content,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: row,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        });
    }


    /* ═══════════════════════════════════════════════════════════════════════
       10. GSAP SCROLL REVEAL ANIMATIONS (Phase 2 Upgrade)
    ═══════════════════════════════════════════════════════════════════════ */
    if (hasGSAP) {
        // Slide-up fade-in for section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {  trigger: header, start: "top 85%" },
                y: 50, opacity: 0, duration: 0.8, ease: "power3.out"
            });
        });

        // Staggered fade-in for collection cards
        gsap.from(".collection-card", {
            scrollTrigger: {  trigger: ".collections-grid", start: "top 80%" },
            y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
        });

        // Slide-in from left for brand story info
        gsap.from(".brand-story-info", {
            scrollTrigger: {  trigger: ".brand-story-section", start: "top 75%" },
            x: -60, opacity: 0, duration: 1, ease: "power3.out"
        });

        // Parallax scroll effect for brand story image
        gsap.fromTo(".brand-story-img", 
            { yPercent: -10 },
            {
                yPercent: 10, ease: "none",
                scrollTrigger: {  trigger: ".brand-story-section",
                    start: "top bottom", end: "bottom top", scrub: true
                }
            }
        );

        // Staggered fade-in for partner cards
        gsap.from(".partner-card", {
            scrollTrigger: {  trigger: ".partners-grid", start: "top 80%" },
            y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
        });

        // Staggered fade-in for news cards
        gsap.from(".news-card", {
            scrollTrigger: {  trigger: ".news-grid", start: "top 80%" },
            y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
        });

        // Animation for all images
        gsap.utils.toArray('img:not(.hero-slide-iframe)').forEach(img => {
            gsap.from(img, {
                scrollTrigger: { trigger: img, start: "top 90%" },
                y: 40, opacity: 0, duration: 0.8, ease: "power3.out"
            });
        });

        // Animation for each slide when scrolling down
        gsap.utils.toArray('.hero-slide, .showcase-slide').forEach(slide => {
            gsap.from(slide, {
                scrollTrigger: { trigger: slide, start: "top 85%" },
                y: 50, opacity: 0, duration: 1, ease: "power3.out"
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       10B. 360° WATCH VIEWER (Interactive Image Sequence)
    ═══════════════════════════════════════════════════════════════════════ */
    const canvas360 = document.getElementById("watch-canvas");
    if (canvas360) {
        const ctx360 = canvas360.getContext("2d");
        const container360 = document.getElementById("viewer-canvas-container");
        const frameCount = 36;
        const currentFrame = index => `assets/360/frame_${String(index + 1).padStart(2, '0')}.png`;

        const images360 = [];
        const watch360 = { frame: 0 };

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.onload = () => {
                if (watch360.frame === i) {
                    render360();
                }
            };
            img.src = currentFrame(i);
            images360.push(img);
        }

        function setCanvasSize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.max(300, container360.clientWidth);
            const h = Math.max(300, container360.clientHeight);
            canvas360.width = Math.floor(w * dpr);
            canvas360.height = Math.floor(h * dpr);
            canvas360.style.width = w + 'px';
            canvas360.style.height = h + 'px';
            ctx360.setTransform(dpr, 0, 0, dpr, 0, 0);
            render360();
        }

        function render360() {
            const w = Math.max(300, container360.clientWidth);
            const h = Math.max(300, container360.clientHeight);
            ctx360.clearRect(0, 0, canvas360.width, canvas360.height);
            const img = images360[watch360.frame];
            if (img && img.complete) {
                ctx360.drawImage(img, 0, 0, w, h);
            }
        }

        // initialize size and handle resize
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        if (hasGSAP) {
            // Scroll Scrubbing (no external scroller assumed)
            gsap.to(watch360, {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: ".viewer-360",
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 0.5
                },
                onUpdate: render360
            });

            // Zoom effect on enter
            gsap.fromTo(canvas360,
                { scale: 0.85, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".viewer-360", start: "top 75%" } }
            );
        }

        // Drag functionality for manual rotation (attach to container for better hit area)
        let isDragging360 = false;
        let startX360 = 0;

        container360.addEventListener('mousedown', (e) => { isDragging360 = true; startX360 = e.clientX; document.body.style.cursor = 'grabbing'; });
        container360.addEventListener('touchstart', (e) => { isDragging360 = true; startX360 = e.touches[0].clientX; }, { passive: true });

        window.addEventListener('mouseup', () => { isDragging360 = false; document.body.style.cursor = ''; });
        window.addEventListener('touchend', () => isDragging360 = false);

        container360.addEventListener('mousemove', (e) => handleDrag360(e.clientX));
        container360.addEventListener('touchmove', (e) => handleDrag360(e.touches[0].clientX), { passive: true });

        function handleDrag360(clientX) {
            if (!isDragging360) return;
            const deltaX = clientX - startX360;
            if (Math.abs(deltaX) > 8) { // sensitivity
                if (deltaX > 0) watch360.frame = (watch360.frame + 1) % frameCount;
                else watch360.frame = (watch360.frame - 1 + frameCount) % frameCount;
                render360();
                startX360 = clientX;
            }
        }

        // Try to autoplay the viewer media video if present (muted autoplay allowed on mobile)
        const viewerVideo = document.getElementById('viewer-media-video');
        if (viewerVideo) {
            const viewerImg = document.getElementById('viewer-media-img');
            viewerVideo.muted = true;
            viewerVideo.playsInline = true;
            const tryPlay = async () => {
                try {
                    await viewerVideo.play();
                    // if play succeeds, ensure video visible and image hidden
                    viewerVideo.style.display = 'block';
                    if (viewerImg) viewerImg.style.display = 'none';
                } catch (e) {
                    // fallback to image if autoplay blocked or video missing
                    viewerVideo.style.display = 'none';
                    if (viewerImg) viewerImg.style.display = 'block';
                }
            };

            // Attempt autoplay on load, and also on first interaction
            window.addEventListener('load', tryPlay);
            document.addEventListener('click', tryPlay, { once: true });
            document.addEventListener('touchstart', tryPlay, { once: true, passive: true });

            // If video has no source or fails to load, show image after short timeout
            setTimeout(() => {
                const hasSrc = viewerVideo.querySelector('source') && viewerVideo.querySelector('source').getAttribute('src');
                if (!hasSrc) {
                    viewerVideo.style.display = 'none';
                    if (viewerImg) viewerImg.style.display = 'block';
                }
            }, 300);
        }
    }


    /* ═══════════════════════════════════════════════════════════════════════
       11. BRAND STORY STATISTICS COUNT-UP
    ═══════════════════════════════════════════════════════════════════════ */
    const statsContainer = document.querySelector(".brand-story-stats");
    const statNumbers    = document.querySelectorAll(".stat-number[data-target]");
    let   statsAnimated  = false;

    function runStatsCount() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            const suffix = stat.querySelector("span")?.outerHTML || "";
            let   count  = 0;
            const step   = target > 1000 ? Math.ceil(target / 45) : 1;
            const speed  = target > 1000 ? 45 : 28;

            const timer = setInterval(() => {
                count += step;
                if (count >= target) { count = target; clearInterval(timer); }
                stat.innerHTML = count + suffix;
            }, speed);
        });
    }

    if (statsContainer) {
        if (hasGSAP) {
            ScrollTrigger.create({  trigger: statsContainer,
                start:   "top bottom-=80",
                onEnter: runStatsCount,
            });
        } else {
            new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) runStatsCount();
            }, { threshold: 0.25 }).observe(statsContainer);
        }
    }


    /* ═══════════════════════════════════════════════════════════════════════
       12. WATCH SHOWCASE SLIDER — with TOUCH SWIPE support
    ═══════════════════════════════════════════════════════════════════════ */
    const sliderWrapper = document.getElementById("showcase-wrapper");
    const slides        = document.querySelectorAll(".showcase-slide");
    const bullets       = document.querySelectorAll(".showcase-bullet");
    const prevBtn       = document.getElementById("prev-slide");
    const nextBtn       = document.getElementById("next-slide");

    if (sliderWrapper && slides.length > 0) {
        let currentIndex  = 0;
        let isAnimating   = false;

        function updateSlider(index) {
            if (isAnimating) return;
            isAnimating = true;

            currentIndex = ((index % slides.length) + slides.length) % slides.length;

            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

            bullets.forEach((b, i) => b.classList.toggle("active", i === currentIndex));

            // GSAP content animations (desktop) — skip on slow mobile
            if (hasGSAP && isDesktop()) {
                const slide     = slides[currentIndex];
                const img       = slide.querySelector(".showcase-img");
                const model     = slide.querySelector(".showcase-model");
                const specItems = slide.querySelectorAll(".showcase-spec-item");
                const desc      = slide.querySelector(".showcase-desc");

                gsap.killTweensOf([img, model, specItems, desc]);
                gsap.fromTo(img,   { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, ease: "power2.out" });
                gsap.fromTo(model, { y:  25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6,  ease: "power2.out", delay: 0.15 });
                gsap.fromTo(desc,  { y:  15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5,  ease: "power2.out", delay: 0.25 });
                gsap.fromTo(specItems, { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.45, delay: 0.3 });
            }

            setTimeout(() => { isAnimating = false; }, 850);
        }

        nextBtn?.addEventListener("click", () => updateSlider(currentIndex + 1));
        prevBtn?.addEventListener("click", () => updateSlider(currentIndex - 1));
        bullets.forEach((b, i) => b.addEventListener("click", () => updateSlider(i)));

        /* --- TOUCH / SWIPE SUPPORT --- */
        let touchStartX  = 0;
        let touchStartY  = 0;
        let touchEndX    = 0;
        const SWIPE_THRESHOLD = 50; // px minimum to register a swipe
        const ANGLE_THRESHOLD = 30; // degrees — ignore if mostly vertical

        sliderWrapper.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        sliderWrapper.addEventListener("touchend", (e) => {
            touchEndX      = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const deltaX   = touchEndX - touchStartX;
            const deltaY   = touchEndY - touchStartY;
            const angle    = Math.abs(Math.atan2(deltaY, deltaX) * (180 / Math.PI));

            // Only handle horizontal swipes (angle close to 0° or 180°)
            if (Math.abs(deltaX) > SWIPE_THRESHOLD && (angle < ANGLE_THRESHOLD || angle > 180 - ANGLE_THRESHOLD)) {
                if (deltaX < 0) {
                    updateSlider(currentIndex + 1); // swipe left → next
                } else {
                    updateSlider(currentIndex - 1); // swipe right → prev
                }
            }
        }, { passive: true });

        /* --- KEYBOARD: arrow keys when slider is in view --- */
        document.addEventListener("keydown", (e) => {
            const sliderRect = sliderWrapper.getBoundingClientRect();
            const inView     = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;
            if (!inView) return;
            if (e.key === "ArrowRight") updateSlider(currentIndex + 1);
            if (e.key === "ArrowLeft")  updateSlider(currentIndex - 1);
        });

        /* --- AUTO-PLAY (pauses on hover/touch) --- */
        let autoPlayTimer = null;

        function startAutoPlay() {
            autoPlayTimer = setInterval(() => updateSlider(currentIndex + 1), 5500);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayTimer);
        }

        startAutoPlay();
        sliderWrapper.addEventListener("mouseenter", stopAutoPlay);
        sliderWrapper.addEventListener("mouseleave", startAutoPlay);
        sliderWrapper.addEventListener("touchstart",  stopAutoPlay, { passive: true });
        // Resume after 8 seconds idle on touch
        sliderWrapper.addEventListener("touchend", () => {
            setTimeout(startAutoPlay, 8000);
        }, { passive: true });
    }


    /* ═══════════════════════════════════════════════════════════════════════
       13. NEWSLETTER FORM
    ═══════════════════════════════════════════════════════════════════════ */
    const newsletterForm    = document.getElementById("newsletter-form");
    const newsletterEmail   = document.getElementById("newsletter-email");
    const newsletterSuccess = document.getElementById("newsletter-success");

    // Exploded View Content Hover Sync
    const infoBlocks = document.querySelectorAll(".exploded-info-block");
    if (infoBlocks.length > 0 && explodedRows.length > 0) {
        infoBlocks.forEach((block, index) => {
            block.addEventListener("mouseenter", () => {
                if (explodedRows[index]) {
                    const img = explodedRows[index].querySelector(".exploded-parallax-img");
                    if (img && hasGSAP) {
                        gsap.to(img, { scale: 1.05, filter: "grayscale(0%) contrast(1.15) brightness(1)", duration: 0.4 });
                    }
                }
            });
            block.addEventListener("mouseleave", () => {
                if (explodedRows[index]) {
                    const img = explodedRows[index].querySelector(".exploded-parallax-img");
                    if (img && hasGSAP) {
                        gsap.to(img, { scale: 1, filter: "grayscale(10%) contrast(1.05) brightness(0.85)", duration: 0.4 });
                    }
                }
            });
        });
    }


    if (newsletterForm && newsletterEmail && newsletterSuccess) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();

            newsletterEmail.value          = "";
            newsletterSuccess.style.display = "block";
            newsletterSuccess.style.opacity = "0";

            // Simple fade-in
            requestAnimationFrame(() => {
                newsletterSuccess.style.transition = "opacity 0.4s ease";
                newsletterSuccess.style.opacity    = "1";
            });

            setTimeout(() => {
                newsletterSuccess.style.opacity = "0";
                setTimeout(() => { newsletterSuccess.style.display = "none"; }, 400);
            }, 4000);
        });
    }


    /* ═══════════════════════════════════════════════════════════════════════
       14. RESIZE HANDLER — refresh ScrollTrigger & reset slider on resize
    ═══════════════════════════════════════════════════════════════════════ */
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (hasGSAP) {
                ScrollTrigger.refresh();
            }
        }, 250);
    });


    /* ═══════════════════════════════════════════════════════════════════════
       15. WATCH DETAILS PAGE INTERACTIVE LOGIC
       ═══════════════════════════════════════════════════════════════════════ */
    // Gallery Switcher
    const thumbBtns = document.querySelectorAll(".thumb-btn");
    const mainProductImg = document.getElementById("main-product-image");

    if (thumbBtns.length > 0 && mainProductImg) {
        thumbBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                // Remove active class
                thumbBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const targetImg = btn.getAttribute("data-img");
                if (targetImg) {
                    if (hasGSAP) {
                        // Smooth fade and zoom transition for image switch
                        gsap.timeline()
                            .to(mainProductImg, { opacity: 0, scale: 0.95, duration: 0.2, ease: "power2.in" })
                            .call(() => {
                                mainProductImg.setAttribute("src", targetImg);
                            })
                            .to(mainProductImg, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
                    } else {
                        mainProductImg.setAttribute("src", targetImg);
                    }
                }
            });
        });
    }

    // Strap Color Customizer
    const strapBtns = document.querySelectorAll(".strap-color-btn");
    const selectedStrapName = document.getElementById("selected-strap-name");
    const activeStrapBadge = document.getElementById("active-strap-badge");
    const strapGlow = document.getElementById("strap-glow");

    if (strapBtns.length > 0) {
        const strapNames = {
            black: "Stealth Black",
            orange: "Racing Orange",
            red: "Monaco Red",
            gold: "Aureum Gold"
        };

        strapBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                strapBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const strapKey = btn.getAttribute("data-strap");
                const colorHex = btn.getAttribute("data-color-hex");
                const humanName = strapNames[strapKey] || "Custom Strap";

                if (selectedStrapName) selectedStrapName.textContent = humanName;
                if (activeStrapBadge) activeStrapBadge.textContent = humanName;

                if (strapGlow && colorHex) {
                    if (hasGSAP) {
                        gsap.to(strapGlow, {
                            background: `radial-gradient(circle, ${colorHex} 0%, transparent 70%)`,
                            opacity: 0.22,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    } else {
                        strapGlow.style.background = `radial-gradient(circle, ${colorHex} 0%, transparent 70%)`;
                    }
                }

                if (mainProductImg) {
                    let filterStyle = "none";
                    if (humanName.includes("Black")) {
                        filterStyle = "grayscale(1)";
                    } else if (humanName.includes("Orange")) {
                        filterStyle = "none";
                    } else if (humanName.includes("Red")) {
                        filterStyle = "hue-rotate(-20deg) saturate(1.5)";
                    } else if (humanName.includes("Gold")) {
                        filterStyle = "hue-rotate(20deg) saturate(1.2) brightness(1.2)";
                    }

                    if (hasGSAP) {
                        gsap.fromTo(mainProductImg, 
                            { scale: 0.95, opacity: 0.8 }, 
                            { filter: filterStyle, scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
                        );
                    } else {
                        mainProductImg.style.filter = filterStyle;
                    }
                }
            });
        });
    }

    // Quantity Selector
    const qtyMinus = document.getElementById("qty-minus");
    const qtyPlus = document.getElementById("qty-plus");
    const qtyVal = document.getElementById("qty-val");

    if (qtyMinus && qtyPlus && qtyVal) {
        let count = 1;
        qtyMinus.addEventListener("click", () => {
            if (count > 1) {
                count--;
                qtyVal.textContent = count;
            }
        });
        qtyPlus.addEventListener("click", () => {
            if (count < 5) {
                count++;
                qtyVal.textContent = count;
            }
        });
    }

    // Checkout Alert
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const quantity = qtyVal ? qtyVal.textContent : 1;
            const strapName = selectedStrapName ? selectedStrapName.textContent : "Stealth Black";
            
            // Create a custom modern modal notification instead of a native alert to look premium
            const modal = document.createElement("div");
            modal.style.position = "fixed";
            modal.style.inset = "0";
            modal.style.background = "rgba(7, 7, 8, 0.9)";
            modal.style.backdropFilter = "blur(15px)";
            modal.style.display = "flex";
            modal.style.alignItems = "center";
            modal.style.justifyContent = "center";
            modal.style.zIndex = "2000";
            modal.style.opacity = "0";
            modal.style.transition = "opacity 0.4s ease";
            
            modal.innerHTML = `
                <div style="background: var(--bg-secondary); border: 1px solid var(--accent-gold); border-radius: 24px; padding: 40px; text-align: center; max-width: 500px; width: 90%; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--glow-color); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <svg viewBox="0 0 24 24" style="width: 30px; height: 30px;" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.8rem; text-transform: uppercase; margin-bottom: 15px; color: var(--text-primary);">Order Initiated</h3>
                    <p style="font-family: var(--font-body); font-size: 1rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 30px;">
                        Thank you for your pre-order of <strong style="color: var(--text-primary);">${quantity}x Mille-X MX-74 Tourbillon</strong> with <strong style="color: var(--accent-gold);">${strapName} Strap</strong>.<br><br>
                        A personal concierge will contact you via email shortly to coordinate payment and delivery.
                    </p>
                    <button id="close-modal-btn" class="btn btn-primary" style="padding: 12px 30px; border-radius: 6px;">Close Window</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Fade-in animation
            requestAnimationFrame(() => {
                modal.style.opacity = "1";
            });
            
            const closeModal = () => {
                modal.style.opacity = "0";
                setTimeout(() => modal.remove(), 400);
            };
            
            modal.querySelector("#close-modal-btn").addEventListener("click", closeModal);
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeModal();
            });
        });
    }

    // Technical Accordion Collapse/Expand Logic
    const accordionTriggers = document.querySelectorAll(".accordion-trigger");
    if (accordionTriggers.length > 0) {
        accordionTriggers.forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const item = trigger.closest(".accordion-item");
                const panel = item.querySelector(".accordion-panel");
                const isExpanded = trigger.getAttribute("aria-expanded") === "true";

                // Collapse all other accordion items for clean UX
                document.querySelectorAll(".accordion-item").forEach((otherItem) => {
                    if (otherItem !== item) {
                        otherItem.classList.remove("active");
                        const otherTrigger = otherItem.querySelector(".accordion-trigger");
                        const otherPanel = otherItem.querySelector(".accordion-panel");
                        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
                        if (otherPanel) {
                            otherPanel.style.maxHeight = "0px";
                            otherPanel.style.opacity = "0";
                            otherPanel.style.padding = "0px";
                        }
                    }
                });

                // Toggle current item
                if (isExpanded) {
                    item.classList.remove("active");
                    trigger.setAttribute("aria-expanded", "false");
                    panel.style.maxHeight = "0px";
                    panel.style.opacity = "0";
                    panel.style.padding = "0px";
                } else {
                    item.classList.add("active");
                    trigger.setAttribute("aria-expanded", "true");
                    panel.style.maxHeight = panel.scrollHeight + 40 + "px"; // scrollHeight + padding buffer
                    panel.style.opacity = "1";
                    panel.style.padding = "20px 0";
                }
            });
        });
    }

    // GSAP page entrance transitions for Details page elements
    const detailsGrid = document.querySelector(".details-grid");
    if (detailsGrid && hasGSAP) {
        const entranceTL = gsap.timeline({ delay: 0.1 });
        entranceTL.from(".details-visual", {
            opacity: 0,
            x: -50,
            duration: 1,
            ease: "power3.out"
        });
        entranceTL.from(".details-info > *", {
            opacity: 0,
            y: 35,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out"
        }, "-=0.75");
    }

});
