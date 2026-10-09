import React, { useEffect } from 'react'

const Toast = ({ msg, handleShow, bgColor }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            handleShow()
        }, 3000)
        return () => clearTimeout(timer)
    }, [handleShow])

    return (
        <div
            className={`toast show position-fixed text-light shadow-lg rounded ${bgColor}`}
            style={{
                top: '20px',
                right: '20px',
                minWidth: '280px',
                zIndex: 9999,
                border: 'none',
                opacity: 0.95
            }}
        >
            <div className={`toast-header text-light ${bgColor} d-flex justify-content-between align-items-center border-0 px-3 py-2`}>
                <strong className="text-light font-weight-bold">{msg.title}</strong>
                <button
                    type="button"
                    className="btn-close btn-close-white ms-auto shadow-none"
                    style={{ outline: 'none', border: 'none', background: 'transparent', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
                    onClick={handleShow}
                >
                    &times;
                </button>
            </div>
            <div className="toast-body px-3 py-2" style={{ fontSize: '0.95rem' }}>
                {msg.body}
            </div>
        </div>
    )
}

export default Toast
