'use client';
import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';
import './dropdown.css';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  trigger?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  'aria-label'?: string;
}

/**
 * HV VERTEX ELECTRONICS — Unified Animated Action Menu
 * Implements WAI-ARIA Menu semantics (role="menu" & role="menuitem")
 * for performing contextual actions rather than selecting values.
 */
export function ActionMenu({
  items,
  trigger,
  align = 'right',
  className = '',
  'aria-label': ariaLabel = 'Actions menu',
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  // Outside click listener
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick, true);
    document.addEventListener('touchstart', handleOutsideClick, true);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('touchstart', handleOutsideClick, true);
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            return;
          }
          let next = highlightedIndex + 1;
          while (next < items.length && items[next].disabled) next++;
          if (next < items.length) setHighlightedIndex(next);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            return;
          }
          let prev = highlightedIndex - 1;
          while (prev >= 0 && items[prev].disabled) prev--;
          if (prev >= 0) setHighlightedIndex(prev);
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0 && items[highlightedIndex] && !items[highlightedIndex].disabled) {
            items[highlightedIndex].onClick?.();
            setIsOpen(false);
            triggerRef.current?.focus();
          } else {
            setIsOpen(true);
          }
          break;
        }
        case 'Escape': {
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
            triggerRef.current?.focus();
          }
          break;
        }
        default:
          break;
      }
    },
    [isOpen, highlightedIndex, items]
  );

  return (
    <div
      ref={containerRef}
      className={`hv-dropdown align-${align} ${isOpen ? 'is-open' : ''} ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        className="hv-dropdown-trigger size-sm"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={ariaLabel}
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger || (
          <>
            <span>Actions</span>
            <motion.span
              className="hv-dropdown-chevron"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.16 }}
            >
              <Icon name="chevron-down" />
            </motion.span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={ariaLabel}
            tabIndex={-1}
            className="hv-dropdown-menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {items.map((item, index) => (
              <li
                key={item.id}
                role="menuitem"
                aria-disabled={item.disabled}
                className={`hv-dropdown-item ${highlightedIndex === index ? 'is-active' : ''} ${
                  item.disabled ? 'is-disabled' : ''
                } ${item.danger ? 'text-danger' : ''}`}
                style={item.danger ? { color: '#f87171' } : undefined}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                onMouseEnter={() => {
                  if (!item.disabled) setHighlightedIndex(index);
                }}
              >
                <span className="hv-dropdown-item-content">
                  {item.icon && (
                    <span className="hv-dropdown-item-icon" aria-hidden="true">
                      {typeof item.icon === 'string' ? <Icon name={item.icon} /> : item.icon}
                    </span>
                  )}
                  <span className="hv-dropdown-item-label">{item.label}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ActionMenu;
