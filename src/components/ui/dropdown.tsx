'use client';
import React, {
  useEffect,
  useId,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';
import './dropdown.css';
import {
  useDropdown,
  type DropdownItem,
} from './useDropdown';


/**
 * Dropdown Component Props
 */
export interface DropdownProps<T = string | number> {
  items: Array<DropdownItem<T> | string | number>;
  value?: T;
  defaultValue?: T;
  onChange?: ((value: T) => void) | ((e: { target: { value: T; name?: string } }) => void);
  placeholder?: string;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
  menuClassName?: string;
  triggerClassName?: string;
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  icon?: string | React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  align?: 'left' | 'right';
  emptyMessage?: string;
}

/**
 * HV VERTEX ELECTRONICS — Unified Animated Dropdown Component
 * Production-grade accessible selection component with Framer Motion transitions
 */
export function Dropdown<T = string | number>({
  items,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select option…',
  disabled = false,
  error = false,
  className = '',
  menuClassName = '',
  triggerClassName = '',
  name,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  icon,
  size = 'md',
  fullWidth = false,
  align = 'left',
  emptyMessage = 'No options available',
}: DropdownProps<T>) {
  const generatedId = useId();
  const triggerId = id || `hv-dropdown-trigger-${generatedId}`;
  const listboxId = `hv-dropdown-listbox-${generatedId}`;

  const {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    selectedItem,
    normalizedItems,
    selectItem,
    openUpward,
    handleKeyDown,
    containerRef,
    triggerRef,
    menuRef,
  } = useDropdown({
    items,
    value,
    defaultValue,
    onChange,
    disabled,
    name,
  });

  // Scroll active option into view inside the dropdown menu ONLY (never scroll the main window)
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && menuRef.current) {
      const menu = menuRef.current;
      const activeEl = menu.children[highlightedIndex] as HTMLElement | undefined;
      if (activeEl) {
        const menuRect = menu.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        if (elRect.bottom > menuRect.bottom) {
          menu.scrollTop += elRect.bottom - menuRect.bottom + 4;
        } else if (elRect.top < menuRect.top) {
          menu.scrollTop -= menuRect.top - elRect.top + 4;
        }
      }
    }
  }, [isOpen, highlightedIndex, menuRef]);

  return (
    <div
      ref={containerRef}
      className={`hv-dropdown size-${size} ${fullWidth ? 'full-width' : ''} align-${align} ${
        isOpen ? 'is-open' : ''
      } ${disabled ? 'is-disabled' : ''} ${error ? 'has-error' : ''} ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        className={`hv-dropdown-trigger ${triggerClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={Boolean(error)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <span className="hv-dropdown-trigger-content">
          {/* Leading Icon */}
          {(icon || selectedItem?.icon) && (
            <span className="hv-dropdown-trigger-icon" aria-hidden="true">
              {typeof (selectedItem?.icon || icon) === 'string' ? (
                <Icon name={String(selectedItem?.icon || icon)} />
              ) : (
                (selectedItem?.icon || icon)
              )}
            </span>
          )}

          {/* Selected Text or Placeholder */}
          {selectedItem ? (
            <span className="hv-dropdown-value-text">{selectedItem.label}</span>
          ) : (
            <span className="hv-dropdown-placeholder">{placeholder}</span>
          )}
        </span>

        {/* Animated Rotating Chevron Indicator */}
        <motion.span
          className="hv-dropdown-chevron"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Icon name="chevron-down" />
        </motion.span>
      </button>

      {/* Animated Dropdown Menu Surface */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel || placeholder}
            aria-activedescendant={
              highlightedIndex >= 0
                ? `${listboxId}-opt-${highlightedIndex}`
                : undefined
            }
            tabIndex={-1}
            className={`hv-dropdown-menu ${menuClassName}`}
            style={
              openUpward
                ? { top: 'auto', bottom: 'calc(100% + 5px)', transformOrigin: 'bottom center' }
                : { top: 'calc(100% + 5px)', transformOrigin: 'top center' }
            }
            initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {normalizedItems.length === 0 ? (
              <li className="hv-dropdown-empty">{emptyMessage}</li>
            ) : (
              normalizedItems.map((item, index) => {
                const isSelected = selectedItem?.value === item.value;
                const isActive = highlightedIndex === index;
                const optionId = `${listboxId}-opt-${index}`;

                return (
                  <li
                    key={`${String(item.value)}-${index}`}
                    id={optionId}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={item.disabled}
                    className={`hv-dropdown-item ${isSelected ? 'is-selected' : ''} ${
                      isActive ? 'is-active' : ''
                    } ${item.disabled ? 'is-disabled' : ''}`}
                    onPointerDown={(e) => {
                      if (item.disabled) return;
                      e.preventDefault();
                      e.stopPropagation();
                      selectItem(item);
                    }}
                    onClick={(e) => {
                      if (item.disabled) return;
                      e.preventDefault();
                      e.stopPropagation();
                      selectItem(item);
                    }}
                    onMouseEnter={() => {
                      if (!item.disabled) setHighlightedIndex(index);
                    }}
                  >
                    <span className="hv-dropdown-item-content">
                      {/* Optional Option Icon */}
                      {item.icon && (
                        <span className="hv-dropdown-item-icon" aria-hidden="true">
                          {typeof item.icon === 'string' ? (
                            <Icon name={item.icon} />
                          ) : (
                            item.icon
                          )}
                        </span>
                      )}

                      <span className="hv-dropdown-item-label">{item.label}</span>

                      {/* Optional Hint */}
                      {item.hint && (
                        <span className="hv-dropdown-item-hint">{item.hint}</span>
                      )}
                    </span>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <motion.span
                        className="hv-dropdown-check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.12 }}
                        aria-hidden="true"
                      >
                        <Icon name="check" />
                      </motion.span>
                    )}
                  </li>
                );
              })
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
