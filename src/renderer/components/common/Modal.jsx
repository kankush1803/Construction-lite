import React from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth, className = '', style = {} }) {
  if (!isOpen) return null;

  const contentStyle = {
    ...(maxWidth ? { maxWidth } : {}),
    ...style,
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className={`modal-content ${className}`.trim()} style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '12px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 650, color: 'var(--color-text)' }}>{title}</h3>
          <button
            className="header-btn"
            style={{ width: '30px', height: '30px', fontSize: '0.85rem' }}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
