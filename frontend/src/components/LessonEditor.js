import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

const LessonEditor = ({ show, onHide, lesson, courseId, onSave, token }) => {
  const [lessonData, setLessonData] = useState({
    title: '',
    content: '',
    duration: 30,
    order: 1
  });

  const [files, setFiles] = useState({
    video: null,
    ppt: null
  });

  const [preview, setPreview] = useState({
    video: null,
    ppt: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (lesson) {
      setLessonData({
        title: lesson.title || '',
        content: lesson.content || '',
        duration: lesson.duration || 30,
        order: lesson.order || 1
      });
      setPreview({
        video: lesson.videoUrl || null,
        ppt: lesson.pptUrl || null
      });
    }
  }, [lesson]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles && uploadedFiles[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: uploadedFiles[0]
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(uploadedFiles[0]);
      setPreview(prev => ({
        ...prev,
        [name]: previewUrl
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      Object.keys(lessonData).forEach(key => {
        formData.append(key, lessonData[key]);
      });

      if (files.video) {
        formData.append('video', files.video);
      }
      if (files.ppt) {
        formData.append('ppt', files.ppt);
      }

      await onSave(courseId, lesson?._id, formData, setUploadProgress);
      onHide();
    } catch (err) {
      setError(err.message || 'Failed to save lesson');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{lesson ? 'Edit Lesson' : 'Add New Lesson'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Lesson Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={lessonData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="content"
              value={lessonData.content}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Duration (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  name="duration"
                  value={lessonData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Order</Form.Label>
                <Form.Control
                  type="number"
                  name="order"
                  value={lessonData.order}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* File Upload Section */}
          <Card className="mb-3">
            <Card.Header>Course Materials</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Lecture</Form.Label>
                    <Form.Control
                      type="file"
                      name="video"
                      onChange={handleFileChange}
                      accept="video/*"
                    />
                    {preview.video && (
                      <div className="mt-2">
                        <video 
                          controls 
                          className="w-100" 
                          style={{ maxHeight: '200px' }}
                        >
                          <source src={preview.video} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Presentation/Notes</Form.Label>
                    <Form.Control
                      type="file"
                      name="ppt"
                      onChange={handleFileChange}
                      accept=".pdf,.ppt,.pptx"
                    />
                    {preview.ppt && (
                      <div className="mt-2">
                        <iframe
                          src={preview.ppt}
                          className="w-100"
                          style={{ height: '200px' }}
                          title="PPT Preview"
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {uploadProgress > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3"
            >
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {uploadProgress}%
                </div>
              </div>
            </motion.div>
          )}

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                'Save Lesson'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LessonEditor;