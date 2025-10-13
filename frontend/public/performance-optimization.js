// Register service worker for improved performance and offline capability
// Note: Service Worker is now registered via serviceWorkerRegistration.js
// This is kept as a fallback for browsers that don't support module imports

// Performance Optimization Script (IIFE)
(function() {
  // ===== IMAGE OPTIMIZATIONS =====
  
  // Lazy load images that are not in the viewport
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const options = {
      rootMargin: '200px', // Load images when they are 200px away from viewport
      threshold: 0.1
    };
    
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.classList.add('loaded');
      });
      return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Check if WebP is supported and use it if available
          if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection && (connection.saveData || connection.effectiveType.includes('2g'))) {
              // Low-quality image for slow connections or data-saver mode
              img.src = img.dataset.srcLow || img.dataset.src;
            } else {
              // High-quality image for fast connections
              img.src = img.dataset.src;
              if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            }
          } else {
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          }
          
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, options);
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  };
  
  // ===== FONT OPTIMIZATIONS =====
  
  // Optimize font loading with font-display swap
  const optimizeFonts = () => {
    // Check for font loading API support
    if ('fonts' in document) {
      // Monitor when fonts are loaded
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }
    
    // Add font display swap to improve font loading performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'CustomFont';
        font-display: swap;
        src: local('Arial');
      }
      
      /* Apply font-display: swap to all Font Awesome icons */
      .fa, .fas, .far, .fal, .fab {
        font-display: swap !important;
      }
    `;
    document.head.appendChild(style);
  };
  
  // ===== SCRIPT OPTIMIZATIONS =====
  
  // Defer non-critical scripts until after page load
  const deferScripts = () => {
    const nonCriticalScripts = [
      // Add URLs of non-critical scripts to defer loading
      // Example: 'https://example.com/analytics.js'
    ];
    
    // Wait until main thread is idle to load non-critical scripts
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        loadNonCriticalScripts();
      }, { timeout: 2000 }); // 2 second timeout as fallback
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      window.addEventListener('load', () => {
        setTimeout(loadNonCriticalScripts, 1000);
      });
    }
    
    function loadNonCriticalScripts() {
      nonCriticalScripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
      });
    }
  };
  
  // ===== RESOURCE HINTS =====
  
  // Add resource hints (preconnect, prefetch, preload)
  const addResourceHints = () => {
    // Common domains to preconnect to
    const preconnectDomains = [
      'https://cdnjs.cloudflare.com',
      'https://cdn.jsdelivr.net',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];
    
    // Add preconnect hints to head
    preconnectDomains.forEach(domain => {
      if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  };
  
  // ===== CORE WEB VITALS OPTIMIZATION =====
  
  // Prevent Layout Shifts (CLS optimization)
  const preventLayoutShifts = () => {
    // Add explicit dimensions to common elements that cause layout shifts
    const commonShiftCausers = document.querySelectorAll('img, iframe, video, .banner, .carousel');
    commonShiftCausers.forEach(element => {
      if (!element.hasAttribute('width') && !element.hasAttribute('height') && 
          !element.hasAttribute('style') && element.tagName.toLowerCase() === 'img') {
        element.style.aspectRatio = '16 / 9'; // Default aspect ratio
      }
    });
  };
  
  // Initialize all performance optimizations
  const initOptimizations = () => {
    // Run immediately
    addResourceHints();
    optimizeFonts();
    preventLayoutShifts();
    
    // Run after DOM is loaded
    window.addEventListener('DOMContentLoaded', () => {
      lazyLoadImages();
    });
    
    // Run after full page load
    window.addEventListener('load', () => {
      deferScripts();
    });
    
    // Monitor network condition changes
    if ('connection' in navigator && navigator.connection.addEventListener) {
      navigator.connection.addEventListener('change', lazyLoadImages);
    }
  };
  
  // Run optimizations
  initOptimizations();
  
  // ===== PERFORMANCE MONITORING =====
  
  // Report Core Web Vitals to console
  if ('PerformanceObserver' in window) {
    try {
      // LCP - Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime, 'Element:', lastEntry.element);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime, 'Event:', entry.name);
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      
      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      let clsEntries = [];
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        }
        console.log('CLS:', clsValue, 'Entries:', clsEntries.length);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.log('Performance Observer error:', e);
    }
  }
})();