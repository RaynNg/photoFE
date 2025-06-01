import React, {useState, useEffect} from "react";
import { Card, CardContent, CardMedia, Link, Typography } from "@mui/material";

import "./styles.css";
import {Link as RouterLink, useParams, useNavigate} from "react-router-dom";
import models from "../../modelData/models";

function UserPhotos () {
    const {userId} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [advancedFeatures, setAdvancedFeatures] = useState(false);

    useEffect(() => {
      async function fetchData() {
        const [userData, photoData] = await Promise.all([
          models.userModel(userId),
          models.photoOfUserModel(userId),
        ]);

        if (userData) setUser(userData);
        else console.error("User not found");

        if (Array.isArray(photoData)) setPhotos(photoData);
        else console.error("Photos not found");
      }
      fetchData();
    }, [userId]);

    useEffect(() => {
      const handleStorageChange = () => {
        const storedValue = localStorage.getItem("advancedFeatures");
        setAdvancedFeatures(storedValue === "true");
      };

      window.addEventListener("storage", handleStorageChange);
      handleStorageChange();

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);

    const formatDate = (date) => {
      return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const handlePhotoClick = (photoId) => {
      if (advancedFeatures) {
        navigate(`/photos/${userId}/${photoId}`);
      }
    };

    if (!user || !photos.length) {
      return <Typography variant="h4">Loading photos...</Typography>;
    }

    return (
      <div className="photo-container">
        {photos.map((photo) => (
          <Card 
            key={photo._id}
            className="photo-card"
            onClick={() => advancedFeatures && handlePhotoClick(photo._id)}
            sx={{cursor: advancedFeatures ? "pointer" : "default"}}
          >
            <CardMedia
              component="img"
              image={`/images/${photo.file_name}`}
              alt={`Photo by ${user.first_name}`}
              className="photo-image"
              loading="lazy"
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                Posted on {formatDate(photo.date_time)}
              </Typography>
              <div className="comment-section">
                <Typography variant="h6" gutterBottom>
                  Comments
                </Typography>
                {photo.comments &&
                  photo.comments.map((comment) => (
                    <Card key={comment._id} className="comment-card">
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(comment.date_time)} -
                        <Link
                          component={RouterLink}
                          to={`/users/${comment.user._id}`}
                          color="primary"
                          sx={{ ml: 1 }}
                        >
                          {comment.user.first_name} {comment.user.last_name}
                        </Link>
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {comment.comment}
                      </Typography>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
}

export default UserPhotos;
