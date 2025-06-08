import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Button, TextField } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await models.userModel(userId);
        if (data) {
          setUser(data);
          setEditData(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    if (userId) fetchUser();
  }, [userId]);

  const handleEdit = () => setEditing(true);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updated = await models.editUser(userId, editData);
      setUser(updated);
      setEditing(false);
    } catch (err) {
      alert("Update failed!");
    }
  };

  if (!user) {
    return <Typography variant="h4">Loading user...</Typography>;
  }

  return (
    <Card className="user-detail-card">
      <CardContent>
        <div className="user-detail-header">
          {editing ? (
            <>
              <TextField
                label="First Name"
                name="first_name"
                value={editData.first_name || ""}
                onChange={handleChange}
                sx={{ mr: 1 }}
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={editData.last_name || ""}
                onChange={handleChange}
              />
            </>
          ) : (
            <Typography variant="h4" gutterBottom>
              {user.first_name} {user.last_name}
            </Typography>
          )}
          {editing ? (
            <TextField
              label="Occupation"
              name="occupation"
              value={editData.occupation || ""}
              onChange={handleChange}
              sx={{ mt: 1 }}
            />
          ) : (
            <Typography variant="h6" color="textSecondary">
              {user.occupation}
            </Typography>
          )}
        </div>
        {editing ? (
          <>
            <TextField
              label="Location"
              name="location"
              value={editData.location || ""}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 1 }}
            />
            <TextField
              label="Description"
              name="description"
              value={editData.description || ""}
              onChange={handleChange}
              fullWidth
              multiline
              sx={{ mt: 1 }}
            />
          </>
        ) : (
          <>
            <Typography variant="body1" className="user-detail-location">
              Location: {user.location}
            </Typography>
            <Typography variant="body1" className="user-detail-description">
              {user.description}
            </Typography>
          </>
        )}
        <Button 
          variant="contained" 
          component={Link} 
          to={`/photos/${user._id}`}
          color="primary"
          className="photos-button"
          sx={{ mt: 2, mr: 2 }}
        >
          View Photos
        </Button>
        {editing ? (
          <Button variant="contained" color="success" onClick={handleSave} sx={{ mt: 2 }}>
            Save
          </Button>
        ) : (
          <Button variant="outlined" color="secondary" onClick={handleEdit} sx={{ mt: 2 }}>
            Edit
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default UserDetail;