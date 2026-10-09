import React from 'react'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import Search from './Search'

const Header = () => {
    return (
        <div className="header bg-light border-bottom sticky-top">
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-items-center max-width-1000 mx-auto px-3 py-2">
                <Link to="/" className="logo text-decoration-none">
                    <h1 className="navbar-brand text-uppercase p-0 m-0 font-weight-bold" onClick={() => window.scrollTo({ top: 0 })}>
                        V-Network
                    </h1>
                </Link>

                <Search />
                <Menu />
            </nav>
        </div>
    )
}

export default Header
