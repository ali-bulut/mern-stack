import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';

import {AuthContext} from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = () => {
    const auth = useContext(AuthContext);
    return (
            <ul className="nav-links">
                <li style={{marginRight: 25 + 'px'}}>
                    <NavLink to="/" exact>All Users</NavLink>
                </li>
                {auth.isLoggedIn && <li style={{marginRight: 25 + 'px'}}>
                    <NavLink to="/u1/places">My Places</NavLink>
                </li>}
                {auth.isLoggedIn &&<li style={{marginRight: 25 + 'px'}}>
                    <NavLink to="/places/new">Add Place</NavLink>
                </li>}
                {!auth.isLoggedIn &&<li style={{marginRight: 25 + 'px'}}>
                    <NavLink to="/auth">Authenticate</NavLink>
                </li>}
                {auth.isLoggedIn &&<li style={{marginRight: 25 + 'px'}}>
                    <button onClick={auth.logout}>Log Out</button>
                </li>}
            </ul>
    );
};

export default NavLinks;