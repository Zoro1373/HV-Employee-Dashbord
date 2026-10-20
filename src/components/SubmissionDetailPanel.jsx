import React, { useState } from 'react';
import Icon from './Icon';
import Dropdown from './ui/dropdown';

export default function SubmissionDetailPanel({
  submission,
  index,
  isOpen,
  onClose,
  onSaveGrade,
}) {
  const currentGrade = submission ? (submission.g === 'N' ? 'Needs rework' : submission.g || 'A') : 'A';
  const [prevSubmission, setPrevSubmission] = useState(submission);
  const [grade, setGrade] = useState(currentGrade);

  if (submission !== prevSubmission) {
    setPrevSubmission(submission);
    setGrade(currentGrade);
  }

  if (!submission) return null;

  const initials = submission.n
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <aside
      className={`panel ${isOpen ? 'open' : ''}`}
      aria-label="Details"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Submission</h2>
        <button
          className="ibtn"
          style={{ width: 36, height: 36, boxShadow: 'none', background: 'var(--card2)' }}
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="x" />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="ava" style={{ width: 48, height: 48, fontSize: 15 }}>
          {initials}
        </div>
        <div>
          <b>{submission.n}</b>
          <div className="sub" style={{ margin: 0 }}>
            Alpha firmware
          </div>
        </div>
      </div>

      <div className="kv">
        <span>Server time</span>
        <b className="mono">{submission.ts}</b>
      </div>
      <div className="kv">
        <span>SHA-256</span>
        <b className="mono">{submission.h}</b>
      </div>
      <div className="kv">
        <span>Status</span>
        <b>{submission.st}</b>
      </div>

      <label htmlFor="gr" style={{ fontWeight: 700, fontSize: 12, color: 'var(--ink2)' }}>
        Grade
      </label>
      <Dropdown
        id="gr"
        items={['A', 'B', 'C', 'Needs rework']}
        value={grade}
        onChange={setGrade}
        aria-label="Grade"
        fullWidth
        size="sm"
      />

      <button
        className="btn pri"
        type="button"
        style={{ justifyContent: 'center', marginTop: 12 }}
        onClick={() => onSaveGrade(index, grade)}
      >
        Save grade
      </button>
    </aside>
  );
}
