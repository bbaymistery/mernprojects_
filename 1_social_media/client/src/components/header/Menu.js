import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/authAction'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Avatar from '../Avatar'
import NotifyModal from '../NotifyModal'

const navLinks = [
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'Message', icon: 'near_me', path: '/message' },
    { label: 'Discover', icon: 'explore', path: '/discover' }
]

const Menu = () => {
    const { auth, theme, notify } = useSelector(state => state)
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const [showProfileDropdown, setShowProfileDropdown] = useState(false)
    const [showNotifyDropdown, setShowNotifyDropdown] = useState(false)

    const isActive = (pn) => {
        if (pn === pathname) return 'active'
    }

    return (
        <div className="menu">
            <ul className="navbar-nav flex-row align-items-center">
                {navLinks.map((link, index) => (
                    <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
                        <Link className="nav-link" to={link.path} onClick={() => { setShowProfileDropdown(false); setShowNotifyDropdown(false); }}>
                            <span className="material-icons">{link.icon}</span>
                        </Link>
                    </li>
                ))}

                {/* Notifications Dropdown */}
                <li className="nav-item dropdown position-relative px-2" style={{ opacity: 1 }}>
                    <span
                        className="nav-link position-relative cursor-pointer"
                        role="button"
                        onClick={() => { setShowNotifyDropdown(!showNotifyDropdown); setShowProfileDropdown(false); }}
                    >
                        <span className="material-icons" style={{ color: notify?.data?.length > 0 ? 'crimson' : '' }}>
                            favorite
                        </span>
                        <span className="notify_length">{notify?.data?.length || 0}</span>
                    </span>

                    <div className={`dropdown-menu ${showNotifyDropdown ? 'show' : ''}`} style={{ right: 0, left: 'auto', transform: 'none' }}>
                        <NotifyModal />
                    </div>
                </li>

                {/* Profile & Settings Dropdown */}
                <li className="nav-item dropdown position-relative px-2" style={{ opacity: 1 }}>
                    <span
                        className="nav-link dropdown-toggle d-flex align-items-center cursor-pointer"
                        role="button"
                        onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifyDropdown(false); }}
                    >
                        <Avatar src={auth.user?.avatar} size="medium-avatar" />
                    </span>

                    <div className={`dropdown-menu ${showProfileDropdown ? 'show' : ''}`} style={{ right: 0, left: 'auto' }}>
                        <Link
                            className="dropdown-item"
                            to={`/profile/${auth.user?._id}`}
                            onClick={() => setShowProfileDropdown(false)}
                        >
                            Profile
                        </Link>

                        <label
                            htmlFor="theme"
                            className="dropdown-item cursor-pointer mb-0"
                            onClick={() => {
                                dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
                                setShowProfileDropdown(false);
                            }}
                        >
                            {theme ? 'Light mode' : 'Dark mode'}
                        </label>

                        <div className="dropdown-divider"></div>

                        <Link
                            className="dropdown-item"
                            to="/"
                            onClick={() => {
                                setShowProfileDropdown(false);
                                dispatch(logout());
                            }}
                        >
                            Logout
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Menu
