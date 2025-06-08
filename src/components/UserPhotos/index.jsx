import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import PhotoStepper from "../PhotoStepper";
import "./styles.css";
import { useAuth } from "../../context/AuthContext";

function UserPhotos() {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const { currentUser } = useAuth();

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [userData, photoData] = await Promise.all([
        models.userModel(userId),
        models.photoOfUserModel(userId),
      ]);

      if (userData) setUser(userData);
      else console.error("User not found");

      if (Array.isArray(photoData)) {
        const sortedPhotos = photoData.sort(
          (a, b) => new Date(b.date_time) - new Date(a.date_time)
        );
        setPhotos(sortedPhotos);
      } else {
        console.error("Photos not found");
      }
    }

    fetchData();
  }, [userId]);

  const handleCommentChange = (photoId, value) => {
    setCommentTexts((prev) => ({ ...prev, [photoId]: value }));
  };

  const handleAddComment = async (photoId) => {
    const text = commentTexts[photoId]?.trim();
    if (!text) return alert("Comment cannot be empty");

    try {
      const updatedPhoto = await models.addCommentToPhoto(
        photoId,
        text,
        currentUser._id
      );

      setPhotos((prevPhotos) =>
        prevPhotos.map((p) => (p._id === photoId ? updatedPhoto : p))
      );
      setCommentTexts((prev) => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  useEffect(() => {
    const storedValue =
      localStorage.getItem("advancedFeaturesEnabled") || "false";
    setAdvancedFeatures(storedValue === "true");
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
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

  const handleDeletePost = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await models.deletePhoto(photoId);
      setPhotos((prevPhotos) => prevPhotos.filter((p) => p._id !== photoId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (photoId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await models.deleteCommentOfPhoto(photoId, commentId);
      setPhotos((prevPhotos) =>
        prevPhotos.map((p) =>
          p._id === photoId
            ? { ...p, comments: p.comments.filter((c) => c._id !== commentId) }
            : p
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditComment = async (photoId, commentId, newComment) => {
    if (!newComment.trim()) return alert("Comment cannot be empty");
    try {
      await models.editCommentOfPhoto(photoId, commentId, newComment);
      setPhotos((prevPhotos) =>
        prevPhotos.map((p) =>
          p._id === photoId
            ? {
                ...p,
                comments: p.comments.map((c) =>
                  c._id === commentId ? { ...c, comment: newComment } : c
                ),
              }
            : p
        )
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (error) {
      alert("Edit comment failed!");
      console.error(error);
    }
  };

  if (!user || !photos.length) {
    return <Typography variant="h4">Loading photos...</Typography>;
  }

  if (advancedFeatures && photoId) {
    return <PhotoStepper user={user} photos={photos} />;
  }

  if (advancedFeatures && !photoId) {
    navigate(`/photos/${userId}/${photos[0]._id}`, { replace: true });
    return null;
  }

  const BACKEND_URL = "http://localhost:8081";

  return (
    <div className="photo-container">
      {photos.map((photo) => (
        <Card
          key={photo._id}
          className={`photo-card ${advancedFeatures ? "clickable" : ""}`}
          onClick={() => advancedFeatures && handlePhotoClick(photo._id)}
        >
          <CardMedia
            component="img"
            image={`${BACKEND_URL}/images/${photo.file_name}`}
            alt={`Photo by ${user.first_name}`}
            className="photo-image"
            loading="lazy"
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              Posted on {formatDate(photo.date_time)}
            </Typography>
            <div className="comment-section">
              {currentUser && photo.user_id === currentUser._id && (
                  <Button 
                  variant="contained"
                  color="error"
                  onClick={() => handleDeletePost(photo._id)}>Delete</Button>
                )}
              <div className="justify-between">
                <Typography variant="h6" gutterBottom>
                  Comments
                </Typography>
              </div>
              {photo.comments &&
                [...photo.comments]
                  .sort((a, b) => new Date(b.date_time) - new Date(a.date_time))
                  .map((comment) => (
                    <Card key={comment._id} className="comment-card">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="comment-date-user"
                      >
                        {formatDate(comment.date_time)} -{" "}
                        <Link
                          component={RouterLink}
                          to={`/users/${comment.user._id}`}
                          color="primary"
                          className="comment-user-link"
                        >
                          {comment.user.first_name} {comment.user.last_name}
                        </Link>
                      </Typography>
                      {editingCommentId === comment._id ? (
                        <>
                          <TextField
                            value={editingCommentText}
                            onChange={e => setEditingCommentText(e.target.value)}
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ mt: 1, mr: 1 }}
                            onClick={() =>
                              handleEditComment(photo._id, comment._id, editingCommentText)
                            }
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            sx={{ mt: 1 }}
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingCommentText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography variant="body1" className="comment-text">
                            {comment.comment}
                          </Typography>
                          {currentUser && comment.user._id === currentUser._id && (
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{ mt: 1, mr: 1 }}
                              onClick={() => {
                                setEditingCommentId(comment._id);
                                setEditingCommentText(comment.comment);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                          {currentUser && (photo.user_id === currentUser._id || comment.user._id === currentUser._id) && (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{ mt: 1 }}
                              onClick={() => handleDeleteComment(photo._id, comment._id)}
                            >
                              Delete Comment
                            </Button>
                          )}
                        </>
                      )}
                    </Card>
                  ))}
            </div>

            {currentUser && (
              <Box mt={2}>
                <TextField
                  fullWidth
                  multiline
                  label="Add a comment"
                  value={commentTexts[photo._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(photo._id, e.target.value)
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={() => handleAddComment(photo._id)}
                >
                  Post
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
