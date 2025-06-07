import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import models from "../../modelData/models";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function PhotoUploadDialog({
  open,
  onClose,
  onSuccess,
  userId,
  advancedFeatures,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError("");

    try {
      const uploadedPhoto = await models.uploadPhoto(selectedFile, userId);

      onSuccess(uploadedPhoto);

      handleClose();
    } catch (error) {
      setError("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload New Photo</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="label" className="upload-box">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <CloudUploadIcon className="upload-icon" />
          <Typography>
            {selectedFile ? selectedFile.name : "Click or drag to upload photo"}
          </Typography>
        </Box>

        {previewUrl && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <img src={previewUrl} alt="Preview" className="preview-image" />
          </Box>
        )}

        {uploading && (
          <Box className="upload-progress">
            <LinearProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          variant="contained"
          color="primary"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PhotoUploadDialog;
