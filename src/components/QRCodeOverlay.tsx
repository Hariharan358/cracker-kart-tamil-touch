import { useEffect, useState } from "react";
import { X } from "lucide-react";

export const QRCodeOverlay = () => {
  const [qrPopups, setQrPopups] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const findQRPopups = () => {
      // Look for common QR code popup selectors
      const selectors = [
        '[class*="qr"]',
        '[class*="QR"]',
        '[class*="payment"]',
        '[class*="popup"]',
        '[class*="modal"]',
        'div[style*="position: fixed"]',
        'div[style*="z-index"]'
      ];

      const foundPopups: HTMLElement[] = [];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const el = element as HTMLElement;
          // Check if it looks like a QR code popup
          if (
            el.textContent?.includes('QR') ||
            el.textContent?.includes('UPI') ||
            el.textContent?.includes('Scan') ||
            el.textContent?.includes('pay') ||
            el.textContent?.includes('Vimali') ||
            el.textContent?.includes('@okaxis') ||
            el.textContent?.includes('@okicici') ||
            el.style.position === 'fixed' ||
            el.style.zIndex ||
            el.classList.contains('fixed') ||
            el.classList.contains('modal') ||
            el.classList.contains('popup')
          ) {
            foundPopups.push(el);
          }
        });
      });

      setQrPopups(foundPopups);
    };

    // Initial check
    findQRPopups();

    // Set up observer to watch for new popups
    const observer = new MutationObserver(() => {
      findQRPopups();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => observer.disconnect();
  }, []);

  const addCloseButton = (popup: HTMLElement) => {
    // Check if close button already exists
    if (popup.querySelector('.qr-close-btn')) {
      return;
    }

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'qr-close-btn fixed top-4 right-4 z-[10000] bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors';
    closeBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    
    closeBtn.onclick = () => {
      popup.style.display = 'none';
      popup.remove();
    };

    // Create back button
    const backBtn = document.createElement('button');
    backBtn.className = 'qr-back-btn fixed top-4 left-4 z-[10000] bg-black/50 text-white rounded-lg px-3 py-2 hover:bg-black/70 transition-colors flex items-center gap-2';
    backBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12,19 5,12 12,5"></polyline>
      </svg>
      Back
    `;
    
    backBtn.onclick = () => {
      popup.style.display = 'none';
      popup.remove();
    };

    // Add buttons to the popup
    popup.appendChild(closeBtn);
    popup.appendChild(backBtn);
  };

  useEffect(() => {
    qrPopups.forEach(addCloseButton);
  }, [qrPopups]);

  return null; // This component doesn't render anything visible
}; 