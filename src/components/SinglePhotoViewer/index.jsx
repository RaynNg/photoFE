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
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import models from "../ modelData/models";
import "./styles.css";

function SinglePhotoViewer() {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const userData = await models.userModel(userId);
      const photosData = await models.photoOfUserModel(userId);
      setUser(userData);
      setPhotos(photosData);

      if (photoId && photosData) {
        const index = photosData.findIndex((photo) => photo._id === photoId);
        if (index !== -1) {
          setCurrentPhotoIndex(index);
        }
      }
    };
    loadData();
  }, [userId, photoId]);

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
      navigate(`/photos/${userId}/${photos[newIndex]._id}`);
    }
  };

  const handleNext = () => {
    if (currentPhotoIndex < photos.length - 1) {
      const newIndex = currentPhotoIndex + 1;
      navigate(`/photos/${userId}/${photos[newIndex]._id}`);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      await models.addCommentToPhoto(currentPhoto._id, newComment.trim());
      // Update the photos list to include the new comment
      const updatedPhotos = [...photos];
      const updatedPhoto = {
        ...currentPhoto,
        comments: [
          ...currentPhoto.comments,
          {
            comment: newComment.trim(),
            date_time: new Date().toISOString(),
            user: {
              _id: currentUser._id,
              first_name: currentUser.first_name,
              last_name: currentUser.last_name,
            },
          },
        ],
      };
      updatedPhotos[currentPhotoIndex] = updatedPhoto;
      setPhotos(updatedPhotos);
      setNewComment("");
      setError("");
    } catch (error) {
      setError("Failed to add comment. Please try again.");
    }
  };

  return (
    <Card className="single-photo-card">
      <CardMedia
        component="img"
        image={`/images/${currentPhoto.file_name}`}
        alt={`Photo by ${user.first_name} ${user.last_name}`}
        className="single-photo-image"
      />
      <CardContent>
        <Box className="photo-nav-bar">
          <IconButton
            onClick={handlePrevious}
            disabled={currentPhotoIndex === 0}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="body2" color="textSecondary">
            Posted on {formatDate(currentPhoto.date_time)}
          </Typography>
          <IconButton
            onClick={handleNext}
            disabled={currentPhotoIndex === photos.length - 1}
          >
            <ArrowForward />
          </IconButton>
        </Box>

        <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>

          <form onSubmit={handleAddComment}>
            <Box className="comment-form">
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                error={!!error}
                helperText={error}
              />
              <Box className="comment-submit-button">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!newComment.trim()}
                >
                  Add Comment
                </Button>
              </Box>
            </Box>
          </form>

          <List>
            {currentPhoto.comments?.map((comment, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Link
                        component={RouterLink}
                        to={`/users/${comment.user._id}`}
                        color="primary"
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {comment.comment}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="caption"
                          color="textSecondary"
                        >
                          {formatDate(comment.date_time)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < currentPhoto.comments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </CardContent>
    </Card>
  );
}

export default SinglePhotoViewer;
