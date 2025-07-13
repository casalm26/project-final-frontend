import { useEffect, useCallback, useRef } from 'react';

export const useKeyboardNavigation = (options = {}) => {
  const {
    onEscape,
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus = false,
    autoFocus = false,
    disabled = false,
  } = options;

  const containerRef = useRef(null);
  const focusableElements = useRef([]);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      'summary:not([disabled])',
    ];

    return Array.from(containerRef.current.querySelectorAll(selectors.join(',')))
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
  }, []);

  // Update focusable elements list
  const updateFocusableElements = useCallback(() => {
    focusableElements.current = getFocusableElements();
  }, [getFocusableElements]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    if (disabled) return;

    const { key, shiftKey, ctrlKey, altKey, metaKey } = event;
    
    // Don't handle if modifier keys are pressed (except shift for Tab)
    if ((ctrlKey || altKey || metaKey) && key !== 'Tab') return;

    switch (key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape(event);
        }
        break;

      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter(event);
        }
        break;

      case ' ':
        if (onSpace) {
          event.preventDefault();
          onSpace(event);
        }
        break;

      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;

      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;

      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault();
          onArrowLeft(event);
        }
        break;

      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault();
          onArrowRight(event);
        }
        break;

      case 'Tab':
        if (trapFocus && focusableElements.current.length > 0) {
          event.preventDefault();
          handleTabNavigation(shiftKey);
        }
        if (onTab) {
          onTab(event);
        }
        break;

      default:
        break;
    }
  }, [
    disabled,
    onEscape,
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus,
  ]);

  // Handle tab navigation within trapped focus
  const handleTabNavigation = useCallback((shiftKey) => {
    updateFocusableElements();
    const elements = focusableElements.current;
    
    if (elements.length === 0) return;

    const activeElement = document.activeElement;
    const currentIndex = elements.indexOf(activeElement);

    let nextIndex;
    if (shiftKey) {
      // Shift+Tab: go to previous element
      nextIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
    } else {
      // Tab: go to next element
      nextIndex = currentIndex >= elements.length - 1 ? 0 : currentIndex + 1;
    }

    elements[nextIndex]?.focus();
  }, [updateFocusableElements]);

  // Focus management
  const focusFirst = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElements.current;
    elements[0]?.focus();
  }, [updateFocusableElements]);

  const focusLast = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElements.current;
    elements[elements.length - 1]?.focus();
  }, [updateFocusableElements]);

  const focusNext = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElements.current;
    const activeElement = document.activeElement;
    const currentIndex = elements.indexOf(activeElement);
    const nextIndex = currentIndex >= elements.length - 1 ? 0 : currentIndex + 1;
    elements[nextIndex]?.focus();
  }, [updateFocusableElements]);

  const focusPrevious = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElements.current;
    const activeElement = document.activeElement;
    const currentIndex = elements.indexOf(activeElement);
    const previousIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
    elements[previousIndex]?.focus();
  }, [updateFocusableElements]);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    
    // Auto-focus first element if enabled
    if (autoFocus) {
      const timer = setTimeout(() => {
        focusFirst();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        container.removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, autoFocus, focusFirst]);

  // Update focusable elements on mount and when container changes
  useEffect(() => {
    updateFocusableElements();
  }, [updateFocusableElements]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    updateFocusableElements,
    getFocusableElements,
  };
};

// Hook for handling arrow key navigation in lists/grids
export const useArrowNavigation = (options = {}) => {
  const {
    direction = 'vertical', // 'vertical', 'horizontal', 'grid'
    wrap = true,
    onSelect,
    disabled = false,
  } = options;

  const listRef = useRef(null);
  const currentIndex = useRef(0);

  const handleArrowNavigation = useCallback((event) => {
    if (disabled) return;

    const { key } = event;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;

    event.preventDefault();
    
    const items = listRef.current?.querySelectorAll('[role="option"], [role="menuitem"], [role="gridcell"], .focusable-item');
    if (!items || items.length === 0) return;

    let newIndex = currentIndex.current;

    switch (key) {
      case 'ArrowUp':
        if (direction === 'vertical' || direction === 'grid') {
          newIndex = newIndex > 0 ? newIndex - 1 : (wrap ? items.length - 1 : 0);
        }
        break;

      case 'ArrowDown':
        if (direction === 'vertical' || direction === 'grid') {
          newIndex = newIndex < items.length - 1 ? newIndex + 1 : (wrap ? 0 : items.length - 1);
        }
        break;

      case 'ArrowLeft':
        if (direction === 'horizontal' || direction === 'grid') {
          newIndex = newIndex > 0 ? newIndex - 1 : (wrap ? items.length - 1 : 0);
        }
        break;

      case 'ArrowRight':
        if (direction === 'horizontal' || direction === 'grid') {
          newIndex = newIndex < items.length - 1 ? newIndex + 1 : (wrap ? 0 : items.length - 1);
        }
        break;

      default:
        return;
    }

    currentIndex.current = newIndex;
    items[newIndex]?.focus();

    if (onSelect) {
      onSelect(newIndex, items[newIndex]);
    }
  }, [direction, wrap, onSelect, disabled]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleArrowNavigation);
    return () => container.removeEventListener('keydown', handleArrowNavigation);
  }, [handleArrowNavigation]);

  const setActiveIndex = useCallback((index) => {
    currentIndex.current = index;
  }, []);

  return {
    listRef,
    setActiveIndex,
    currentIndex: currentIndex.current,
  };
};

// Hook for managing skip links
export const useSkipLinks = () => {
  const skipLinksRef = useRef(null);

  const createSkipLink = useCallback((text, targetId) => {
    const link = document.createElement('a');
    link.href = `#${targetId}`;
    link.textContent = text;
    link.className = 'skip-link';
    link.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      border-radius: 4px;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    
    link.addEventListener('focus', () => {
      link.style.opacity = '1';
      link.style.top = '6px';
    });
    
    link.addEventListener('blur', () => {
      link.style.opacity = '0';
      link.style.top = '-40px';
    });

    return link;
  }, []);

  const addSkipLinks = useCallback((links) => {
    const container = skipLinksRef.current || document.body;
    
    links.forEach(({ text, targetId }) => {
      const skipLink = createSkipLink(text, targetId);
      container.appendChild(skipLink);
    });
  }, [createSkipLink]);

  return {
    skipLinksRef,
    addSkipLinks,
  };
}; 