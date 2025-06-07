import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  Button,
  Box,
} from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import "./styles.css";
import TextField from "@mui/material/TextField";
import models from "../../modelData/models";
import { useAuth } from "../../context/AuthContext";

function PhotoStepper({ user, photos }) {
  const { photoId, userId } = useParams();
  const navigate = useNavigate();

  const initialIndex = photos.findIndex((p) => p._id === photoId);
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [photoList, setPhotoList] = useState(photos);

  useEffect(() => {
    const newIndex = photos.findIndex((p) => p._id === photoId);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
    }
  }, [photoId, photos]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevPhotoId = photos[currentIndex - 1]._id;
      navigate(`/photos/${userId}/${prevPhotoId}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      const nextPhotoId = photos[currentIndex + 1]._id;
      navigate(`/photos/${userId}/${nextPhotoId}`);
    }
  };

  if (!photos.length) return <Typography>Loading photos...</Typography>;

  const photo = photoList[currentIndex];

  const handleAddComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return alert("Comment cannot be empty");

    try {
      const updatedPhoto = await models.addCommentToPhoto(
        photo._id,
        trimmed,
        currentUser._id
      );

      const updated = [...photoList];
      updated[currentIndex] = updatedPhoto;
      setPhotoList(updated);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const BACKEND_URL = "http://localhost:8081";

  return (
    <Box className="photo-stepper-container">
      <Typography variant="h5" gutterBottom>
        Photos of {user.first_name} {user.last_name}
      </Typography>

      <Card className="photo-stepper-card">
        <CardMedia
          component="img"
          image={`${BACKEND_URL}/images/${photo.file_name}`}
          alt={`Photo by ${user.first_name}`}
          className="photo-image"
          loading="lazy"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Posted on {new Date(photo.date_time).toLocaleString()}
          </Typography>
          <div className="comment-section">
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            {photo.comments &&
              photo.comments.map((comment) => (
                <Card key={comment._id} className="comment-card">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="comment-date-user"
                  >
                    {new Date(comment.date_time).toLocaleString()} -{" "}
                    <Link
                      component={RouterLink}
                      to={`/users/${comment.user._id}`}
                      color="primary"
                      className="comment-user-link"
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                  </Typography>
                  <Typography variant="body1" className="comment-text">
                    {comment.comment}
                  </Typography>
                </Card>
              ))}

            {currentUser && (
              <Box mt={2}>
                <TextField
                  fullWidth
                  multiline
                  label="Add a comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={handleAddComment}
                >
                  Post
                </Button>
              </Box>
            )}
          </div>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={currentIndex === photos.length - 1}
        >
          Next
        </Button>
      </Box>
      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, textAlign: "center" }}
      >
        {currentIndex + 1} / {photos.length}
      </Typography>
    </Box>
  );
}

export default PhotoStepper;
