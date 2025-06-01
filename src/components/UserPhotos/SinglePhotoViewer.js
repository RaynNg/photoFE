import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import models from "../../modelData/models";
import "./styles.css";

function SinglePhotoViewer() {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const user = models.userModel(userId);
  const photos = models.photoOfUserModel(userId);

  useEffect(() => {
    if (photoId && photos) {
      const index = photos.findIndex((photo) => photo._id === photoId);
      if (index !== -1) {
        setCurrentPhotoIndex(index);
      }
    }
  }, [photoId, photos]);

  if (!user || !photos || photos.length === 0) {
    return <Typography variant="h4">Photos not found</Typography>;
  }

  const currentPhoto = photos[currentPhotoIndex];
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrevious = () => {
    if (currentPhotoIndex > 0) {
      const newIndex = currentPhotoIndex - 1;
      setCurrentPhotoIndex(newIndex);
      navigate(`/photos/${userId}/${photos[newIndex]._id}`);
    }
  };

  const handleNext = () => {
    if (currentPhotoIndex < photos.length - 1) {
      const newIndex = currentPhotoIndex + 1;
      setCurrentPhotoIndex(newIndex);
      navigate(`/photos/${userId}/${photos[newIndex]._id}`);
    }
  };

  return (
    <Box className="single-photo-container">
      <Paper elevation={3} className="photo-navigation">
        <IconButton
          onClick={handlePrevious}
          disabled={currentPhotoIndex === 0}
          color="primary"
          size="large"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">
          Photo {currentPhotoIndex + 1} of {photos.length}
        </Typography>
        <IconButton
          onClick={handleNext}
          disabled={currentPhotoIndex === photos.length - 1}
          color="primary"
          size="large"
        >
          <ArrowForward />
        </IconButton>
      </Paper>

      <Card className="photo-card">
        <CardMedia
          component="img"
          image={`/images/${currentPhoto.file_name}`}
          alt={`Photo by ${user.first_name}`}
          className="photo-image"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            Posted on {formatDate(currentPhoto.date_time)}
          </Typography>
          <div className="comment-section">
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            {currentPhoto.comments &&
              currentPhoto.comments.map((comment) => (
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
    </Box>
  );
}

export default SinglePhotoViewer;
