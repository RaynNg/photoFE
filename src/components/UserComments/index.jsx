import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CardActionArea,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

function UserComments() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUserComments() {
      try {
        // Load user basic info
        const userData = await models.userModel(userId);
        setUser(userData);

        // Load comments made by user on any photo
        const commentData = await models.commentsOfUser(userId);
        setComments(commentData);
      } catch (error) {
        console.error("Error loading user comments:", error);
      }
    }

    loadUserComments();
  }, [userId]);

  const handlePhotoClick = (photoId) => {
    navigate(`/photos/${userId}/${photoId}`);
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  const BACKEND_URL = "http://localhost:8081";

  return (
    <Box className="user-comments" padding={2}>
      <Typography variant="h4" gutterBottom>
        Comments by {user.first_name} {user.last_name}
      </Typography>
      <Grid container spacing={3}>
        {comments.map((comment) => (
          <Grid item xs={12} sm={6} md={4} key={comment.comment_id}>
            <Card>
              <CardActionArea
                onClick={() => handlePhotoClick(comment.photo_id)}
              >
                <CardMedia
                  component="img"
                  image={`${BACKEND_URL}/images/${comment.file_name}`}
                  alt="Photo thumbnail"
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(comment.comment_date_time).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    {comment.comment_text}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default UserComments;
