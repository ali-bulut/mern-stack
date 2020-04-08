import React, {useContext, useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';

import { useHttpClient } from "../../hooks/http-hook";
import {AuthContext} from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = () => {
    const [loadedUsers, setLoadedUsers] = useState();
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const responseData = await sendRequest(
              `http://localhost:5000/api/users`
            );
            setLoadedUsers(responseData.users);
          } catch (err) {}
        };
        fetchUsers();
      }, [sendRequest]);
    
    const auth = useContext(AuthContext);
    return (
            <ul className="nav-links">
                <li style={{marginRight: 25 + 'px'}}>
                    <NavLink to="/" exact>All Users</NavLink>
                </li>
                {auth.isLoggedIn && <li style={{marginRight: 25 + 'px'}}>
                    <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
                </li>}
                {auth.isLoggedIn &&<li style={{marginRight: 25 + 'px'}}>
                    <NavLink to="/places/new">Add Place</NavLink>
                </li>}
                {auth.isLoggedIn && <li style={{marginRight: 25 + 'px'}}>
                    <span>Current User : {loadedUsers.filter(user => user.id === auth.userId).map(user => user.name)}</span>
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