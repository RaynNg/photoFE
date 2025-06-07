import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";
import { useAuth } from "../../context/AuthContext";

function UserList({ showBadges = false }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      const data = await models.userListModel();
      if (Array.isArray(data)) {
        const sortedUsers = data.sort(
          (a, b) => (b.photoCount || 0) - (a.photoCount || 0)
        );
        setUsers(sortedUsers);
      } else {
        console.error("userListModel returned non-array data:", data);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = currentUser
    ? users.filter((user) => user._id !== currentUser._id)
    : users;

  if (!filteredUsers.length) return <div>No users found.</div>;

  return (
    <div className="user-list">
      <List component="nav">
        {filteredUsers.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem disablePadding className="user-list-item">
              <ListItemButton onClick={() => navigate(`/users/${user._id}`)}>
                <Box
                  className="user-list-content"
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                >
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                    secondary={user.occupation}
                  />
                  {showBadges && (
                    <Box className="user-list-badges" display="flex" gap={4}>
                      <Box
                        onClick={(e) => {
                          e.stopPropagation(); // chặn click lan ra ngoài
                          navigate(`/photos/${user._id}`);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <Badge
                          badgeContent={user.photoCount || 0}
                          color="success"
                        />
                      </Box>
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/comments/${user._id}`);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <Badge
                          badgeContent={user.commentCount || 0}
                          color="error"
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
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
