'use client';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

export interface DropdownItem<T = string | number> {
  value: T;
  label: string;
  hint?: string;
  icon?: string | React.ReactNode;
  disabled?: boolean;
}

export interface UseDropdownOptions<T = string | number> {
  items: Array<DropdownItem<T> | string | number>;
  value?: T;
  defaultValue?: T;
  onChange?: ((value: T) => void) | ((e: { target: { value: T; name?: string } }) => void);
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
}

export function useDropdown<T = string | number>({
  items,
  value,
  defaultValue,
  onChange,
  disabled = false,
  onOpenChange,
  name,
}: UseDropdownOptions<T>) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T | undefined>(
    value !== undefined ? value : defaultValue
  );
  const [isOpen, setIsOpenState] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [openUpward, setOpenUpward] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  const searchBufferRef = useRef<string>('');



  const normalizedItems: DropdownItem<T>[] = useMemo(() => {
    return items.map((item) => {
      if (typeof item === 'object' && item !== null && 'value' in item) {
        return {
          value: item.value as T,
          label: item.label !== undefined ? String(item.label) : String(item.value),
          hint: item.hint,
          icon: item.icon,
          disabled: Boolean(item.disabled),
        };
      }
      return {
        value: item as unknown as T,
        label: String(item),
        disabled: false,
      };
    });
  }, [items]);

  const currentValue = isControlled ? value : internalValue;

  const selectedItem = useMemo(() => {
    if (currentValue === undefined || currentValue === null) {
      return normalizedItems.find((it) => it.value === currentValue) || null;
    }
    return (
      normalizedItems.find(
        (it) => it.value === currentValue || String(it.value) === String(currentValue)
      ) || null
    );
  }, [normalizedItems, currentValue]);

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (disabled && open) return;
      setIsOpenState(open);
      onOpenChange?.(open);

      if (open) {
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          const requiredHeight = Math.min(normalizedItems.length * 36 + 16, 280);
          const spaceBelow = window.innerHeight - rect.bottom;
          setOpenUpward(spaceBelow < requiredHeight && rect.top > requiredHeight);
        }

        const selectedIndex = normalizedItems.findIndex((it) =>
          currentValue === undefined || currentValue === null
            ? it.value === currentValue
            : it.value === currentValue || String(it.value) === String(currentValue)
        );
        if (selectedIndex >= 0 && !normalizedItems[selectedIndex].disabled) {
          setHighlightedIndex(selectedIndex);
        } else {
          const firstActive = normalizedItems.findIndex((it) => !it.disabled);
          setHighlightedIndex(firstActive);
        }
      } else {
        setHighlightedIndex(-1);
      }
    },
    [disabled, onOpenChange, normalizedItems, currentValue]
  );

  const selectItem = useCallback(
    (item: DropdownItem<T>) => {
      if (item.disabled) return;

      // Always update internal value so display immediately reflects choice
      setInternalValue(item.value);

      if (onChange) {
        try {
          (onChange as (val: T) => void)(item.value);
        } catch {
          (onChange as (e: { target: { value: T; name?: string } }) => void)({
            target: { value: item.value, name },
          });
        }
      }

      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [onChange, name, setIsOpen]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, setIsOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        let nextIndex = highlightedIndex + 1;
        while (nextIndex < normalizedItems.length && normalizedItems[nextIndex].disabled) {
          nextIndex++;
        }
        if (nextIndex < normalizedItems.length) {
          setHighlightedIndex(nextIndex);
        } else {
          const first = normalizedItems.findIndex((it) => !it.disabled);
          if (first >= 0) setHighlightedIndex(first);
        }
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        let prevIndex = highlightedIndex - 1;
        while (prevIndex >= 0 && normalizedItems[prevIndex].disabled) {
          prevIndex--;
        }
        if (prevIndex >= 0) {
          setHighlightedIndex(prevIndex);
        } else {
          for (let i = normalizedItems.length - 1; i >= 0; i--) {
            if (!normalizedItems[i].disabled) {
              setHighlightedIndex(i);
              break;
            }
          }
        }
        break;
      }

      case 'Home': {
        if (!isOpen) return;
        e.preventDefault();
        const first = normalizedItems.findIndex((it) => !it.disabled);
        if (first >= 0) setHighlightedIndex(first);
        break;
      }

      case 'End': {
        if (!isOpen) return;
        e.preventDefault();
        for (let i = normalizedItems.length - 1; i >= 0; i--) {
          if (!normalizedItems[i].disabled) {
            setHighlightedIndex(i);
            break;
          }
        }
        break;
      }

      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0 && highlightedIndex < normalizedItems.length) {
          selectItem(normalizedItems[highlightedIndex]);
        }
        break;
      }

      case 'Escape': {
        if (isOpen) {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
      }

      case 'Tab': {
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      }

      default: {
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          if (!isOpen) setIsOpen(true);

          if (searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
          }

          searchBufferRef.current += e.key.toLowerCase();
          searchTimeoutRef.current = window.setTimeout(() => {
            searchBufferRef.current = '';
          }, 500);

          const searchStr = searchBufferRef.current;
          const matchIndex = normalizedItems.findIndex(
            (it) => !it.disabled && it.label.toLowerCase().startsWith(searchStr)
          );

          if (matchIndex >= 0) {
            setHighlightedIndex(matchIndex);
          }
        }
        break;
      }
    }
  }, [disabled, isOpen, setIsOpen, highlightedIndex, normalizedItems, selectItem]);

  return {
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
  };
}

export default useDropdown;
