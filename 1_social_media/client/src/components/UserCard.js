import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserCard = ({ children, user, border, handleClose, setShowFollowers, setShowFollowing, msg }) => {
    const { theme } = useSelector(state => state)

    const handleCloseAll = () => {
        if (handleClose) handleClose()
        if (setShowFollowers) setShowFollowers(false)
        if (setShowFollowing) setShowFollowing(false)
    }

    const showMsg = (user) => {
        return (
            <div className="d-flex align-items-center text-muted" style={{ fontSize: '12px' }}>
                <div style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>{user.text}</div>
                {user.media?.length > 0 && <div className="ms-1"><i className="fas fa-image" /> {user.media.length}</div>}
                {user.call && (
                    <span className="material-icons ms-1" style={{ fontSize: '14px' }}>
                        {user.call.times === 0 ? (user.call.video ? 'videocam_off' : 'phone_disabled') : (user.call.video ? 'video_camera_front' : 'call')}
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border || ''}`}>
            <div className="d-flex align-items-center">
                <Link to={`/profile/${user._id}`} onClick={handleCloseAll} className="d-flex align-items-center text-decoration-none">
                    <Avatar src={user.avatar} size="big-avatar" />

                    <div className="ms-2" style={{ transform: 'translateY(-2px)' }}>
                        <span className="d-block font-weight-bold text-dark" style={{ fontSize: '14px', fontWeight: '600', color: '#262626' }}>
                            {user.username}
                        </span>
                        <span className="d-block text-muted" style={{ fontSize: '12px', color: '#8e8e8e' }}>
                            {msg ? showMsg(user) : user.fullname}
                        </span>
                    </div>
                </Link>
            </div>
            {children}
        </div>
    )
}

export default UserCard
