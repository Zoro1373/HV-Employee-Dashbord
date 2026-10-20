import React, { useState } from 'react';
import SpotlightCard from '../SpotlightCard';
import Dropdown from '../ui/dropdown';

export default function ExtensionPassModal({ onClose, onIssuePass }) {
  const [employee, setEmployee] = useState('me');
  const [minutes, setMinutes] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    onIssuePass(employee, Number(minutes));
  };

  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <SpotlightCard className="modal" role="dialog" aria-modal="true">
        <h3>Issue extension pass</h3>
        <p className="sub">One employee may upload after the deadline. The pass is logged.</p>

        <label htmlFor="pe">Employee</label>
        <Dropdown
          id="pe"
          items={[
            { value: 'me', label: 'K. Hitesh Laahiri' },
            { value: 'Ravi Kumar', label: 'Ravi Kumar' },
            { value: 'Meera Shah', label: 'Meera Shah' },
            { value: 'Arun Prasad', label: 'Arun Prasad' },
          ]}
          value={employee}
          onChange={setEmployee}
          fullWidth
          size="md"
        />

        <label htmlFor="pm" style={{ marginTop: 12 }}>Extra time</label>
        <Dropdown
          id="pm"
          items={[
            { value: 15, label: '15 minutes' },
            { value: 30, label: '30 minutes' },
            { value: 60, label: '1 hour' },
          ]}
          value={minutes}
          onChange={(val) => setMinutes(Number(val))}
          fullWidth
          size="md"
        />

        <div className="mfoot">
          <button className="btn out" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn pri" type="button" onClick={handleSubmit}>
            Issue pass
          </button>
        </div>
      </SpotlightCard>
    </div>
  );
}
