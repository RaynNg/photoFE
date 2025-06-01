import React, {useState, useEffect} from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import "./styles.css";
import { Link } from "react-router-dom";
import models from "../../modelData/models";

function UserList () {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      async function loadUsers() {
        const data = await models.userListModel();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("userListModel returned non-array data:", data);
        }
      }
      loadUsers();
    }, []);

    if (!users.length) return <div>No users found.</div>;

    return (
      <div className="user-list">
        <List component="nav">
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem disablePadding className="user-list-item">
                <ListItemButton component={Link} to={`/users/${user._id}`}>
                    <ListItemText 
                      primary={`${user.first_name} ${user.last_name}`}
                      secondary={user.occupation}
                    />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;
