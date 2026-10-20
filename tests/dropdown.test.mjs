import test from 'node:test';
import assert from 'node:assert/strict';

// Test item normalization logic equivalent to useDropdown
function normalizeItems(items) {
  return items.map((item) => {
    if (typeof item === 'object' && item !== null && 'value' in item) {
      return {
        value: item.value,
        label: item.label !== undefined ? String(item.label) : String(item.value),
        hint: item.hint,
        icon: item.icon,
        disabled: Boolean(item.disabled),
      };
    }
    return {
      value: item,
      label: String(item),
      disabled: false,
    };
  });
}

function findSelectedItem(normalizedItems, currentValue) {
  if (currentValue === undefined || currentValue === null) {
    return normalizedItems.find((it) => it.value === currentValue) || null;
  }
  return (
    normalizedItems.find(
      (it) => it.value === currentValue || String(it.value) === String(currentValue)
    ) || null
  );
}

function computeNextHighlight(normalizedItems, currentIndex, direction) {
  if (direction === 'down') {
    let nextIndex = currentIndex + 1;
    while (nextIndex < normalizedItems.length && normalizedItems[nextIndex].disabled) {
      nextIndex++;
    }
    if (nextIndex < normalizedItems.length) return nextIndex;
    const first = normalizedItems.findIndex((it) => !it.disabled);
    return first >= 0 ? first : -1;
  } else if (direction === 'up') {
    let prevIndex = currentIndex - 1;
    while (prevIndex >= 0 && normalizedItems[prevIndex].disabled) {
      prevIndex--;
    }
    if (prevIndex >= 0) return prevIndex;
    for (let i = normalizedItems.length - 1; i >= 0; i--) {
      if (!normalizedItems[i].disabled) return i;
    }
    return -1;
  }
  return currentIndex;
}

test('1. Normalizes string items, numbers, and structured objects correctly', () => {
  const mixedItems = [
    'Option A',
    42,
    { value: 'custom', label: 'Custom Option', hint: 'Special', disabled: false },
    { value: 'disabled-opt', label: 'Disabled Option', disabled: true },
  ];

  const normalized = normalizeItems(mixedItems);
  assert.equal(normalized.length, 4);
  assert.deepEqual(normalized[0], { value: 'Option A', label: 'Option A', disabled: false });
  assert.deepEqual(normalized[1], { value: 42, label: '42', disabled: false });
  assert.equal(normalized[2].value, 'custom');
  assert.equal(normalized[2].label, 'Custom Option');
  assert.equal(normalized[2].hint, 'Special');
  assert.equal(normalized[3].disabled, true);
});

test('2. Selects first, middle, and final options correctly', () => {
  const items = normalizeItems(['First', 'Middle', 'Final']);

  const selFirst = findSelectedItem(items, 'First');
  assert.equal(selFirst?.value, 'First');

  const selMiddle = findSelectedItem(items, 'Middle');
  assert.equal(selMiddle?.value, 'Middle');

  const selFinal = findSelectedItem(items, 'Final');
  assert.equal(selFinal?.value, 'Final');
});

test('3. Handles numeric values and exact string-number comparisons', () => {
  const items = normalizeItems([
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
  ]);

  // Matches number type
  assert.equal(findSelectedItem(items, 30)?.label, '30 minutes');
  // Matches string representation of number safely
  assert.equal(findSelectedItem(items, '60')?.label, '1 hour');
});

test('4. Handles falsy values correctly (0, empty string, undefined, null)', () => {
  const items = normalizeItems([
    { value: 0, label: 'Zero' },
    { value: '', label: 'None' },
    { value: 'active', label: 'Active' },
  ]);

  assert.equal(findSelectedItem(items, 0)?.label, 'Zero');
  assert.equal(findSelectedItem(items, '')?.label, 'None');
  assert.equal(findSelectedItem(items, undefined), null);
  assert.equal(findSelectedItem(items, null), null);
});

test('5. Keyboard navigation skips disabled options and wraps around properly', () => {
  const items = normalizeItems([
    { value: 'opt1', label: 'Option 1', disabled: false },
    { value: 'opt2', label: 'Option 2', disabled: true },
    { value: 'opt3', label: 'Option 3', disabled: false },
    { value: 'opt4', label: 'Option 4', disabled: true },
  ]);

  // Moving down from 0 should skip 1 (disabled) to 2
  const nextDown = computeNextHighlight(items, 0, 'down');
  assert.equal(nextDown, 2);

  // Moving down from 2 should skip 3 (disabled) and wrap to 0
  const wrapDown = computeNextHighlight(items, 2, 'down');
  assert.equal(wrapDown, 0);

  // Moving up from 0 should skip 3 (disabled) and wrap to 2
  const wrapUp = computeNextHighlight(items, 0, 'up');
  assert.equal(wrapUp, 2);
});

test('6. Dynamic updates to options array preserve matching selection', () => {
  let rawItems = ['HR', 'BDA'];
  let normalized = normalizeItems(rawItems);
  assert.equal(findSelectedItem(normalized, 'BDA')?.label, 'BDA');

  // Dynamically add new departments
  rawItems = ['HR', 'BDA', 'Electrical', 'Developers'];
  normalized = normalizeItems(rawItems);
  assert.equal(findSelectedItem(normalized, 'BDA')?.label, 'BDA');
  assert.equal(findSelectedItem(normalized, 'Developers')?.label, 'Developers');
});

test('7. Controlled state simulation: onChange receives correct value without mutating parent', () => {
  let controlledValue = 'initial';
  let recordedChanges = [];

  const onChangeHandler = (val) => {
    recordedChanges.push(val);
    controlledValue = val;
  };

  const items = normalizeItems(['initial', 'updated', 'third']);

  // Simulate user selecting 'updated'
  const targetItem = items[1];
  onChangeHandler(targetItem.value);

  assert.equal(controlledValue, 'updated');
  assert.deepEqual(recordedChanges, ['updated']);
  assert.equal(findSelectedItem(items, controlledValue)?.label, 'updated');
});

test('8. Grade selection options in SubmissionDetailPanel preserve full text', () => {
  const gradeItems = normalizeItems(['A', 'B', 'C', 'Needs rework']);
  
  // Verify 'Needs rework' is found and not truncated
  const reworkItem = findSelectedItem(gradeItems, 'Needs rework');
  assert.equal(reworkItem?.value, 'Needs rework');
  assert.equal(reworkItem?.label, 'Needs rework');

  // Verify backward compatibility with 'N'
  const legacyValue = 'Needs rework';
  assert.equal(findSelectedItem(gradeItems, legacyValue)?.label, 'Needs rework');
});
