import React from 'react';
import '../styles/Navbar.css';

export default function Navbar() {
    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <a href='/' className='navbar-brand'>
                    Learnify
                </a>
                <div className='navbar-nav'>
                    <a href='/' className='nav-link'>Home</a>
                </div>
            </div>
        </nav>
    );
}