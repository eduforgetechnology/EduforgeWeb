import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../styles/courseContentViewer.css';

const CourseContentViewer = ({ lesson, onClose }) => {
  if (!lesson) return null;

  const renderVideo = () => {
    if (!lesson.videoUrl && !lesson.videoEmbedUrl) return null;

    const embedUrl = lesson.videoEmbedUrl || lesson.videoUrl;
    const isGoogleDrive = embedUrl.includes('drive.google.com');

    if (isGoogleDrive) {
      return (
        <div className="content-viewer-media">
          <h5>📹 Video Content</h5>
          <div className="video-container">
            <iframe
              src={embedUrl}
              width="100%"
              height="400"
              allow="autoplay"
              allowFullScreen
              frameBorder="0"
              title={`${lesson.title} - Video`}
            />
          </div>
          <div className="mt-2">
            <Button 
              variant="outline-primary" 
              size="sm" 
              href={lesson.videoUrl} 
              target="_blank"
            >
              <i className="fas fa-external-link-alt me-2"></i>
              Open in Google Drive
            </Button>
          </div>
        </div>
      );
    } else {
      // Local video file
      return (
        <div className="content-viewer-media">
          <h5>📹 Video Content</h5>
          <video controls width="100%" height="400">
            <source src={embedUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  };

  const renderPPT = () => {
    if (!lesson.pptUrl && !lesson.pptEmbedUrl) return null;

    const embedUrl = lesson.pptEmbedUrl || lesson.pptUrl;
    const isGoogleDrive = embedUrl.includes('drive.google.com') || embedUrl.includes('docs.google.com');

    if (isGoogleDrive) {
      return (
        <div className="content-viewer-media">
          <h5>📊 Presentation</h5>
          <div className="ppt-container">
            <iframe
              src={embedUrl}
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
              title={`${lesson.title} - Presentation`}
            />
          </div>
          <div className="mt-2">
            <Button 
              variant="outline-primary" 
              size="sm" 
              href={lesson.pptUrl} 
              target="_blank"
            >
              <i className="fas fa-external-link-alt me-2"></i>
              Open in Google Drive
            </Button>
          </div>
        </div>
      );
    } else {
      // Local PPT file
      return (
        <div className="content-viewer-media">
          <h5>📊 Presentation</h5>
          <div className="ppt-container">
            <iframe
              src={embedUrl}
              width="100%"
              height="400"
              frameBorder="0"
              title={`${lesson.title} - Presentation`}
            />
          </div>
          <div className="mt-2">
            <Button 
              variant="outline-primary" 
              size="sm" 
              href={lesson.pptUrl} 
              target="_blank"
            >
              <i className="fas fa-download me-2"></i>
              Download File
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="course-content-viewer">
      <div className="content-viewer-overlay" onClick={onClose} />
      <div className="content-viewer-modal">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <i className="fas fa-play-circle me-2 text-primary"></i>
              {lesson.title}
            </h4>
            <Button variant="outline-secondary" size="sm" onClick={onClose}>
              <i className="fas fa-times"></i>
            </Button>
          </Card.Header>
          
          <Card.Body>
            {lesson.content && (
              <div className="lesson-description mb-4">
                <h6>📝 Lesson Description</h6>
                <p>{lesson.content}</p>
              </div>
            )}

            {renderVideo()}
            
            {(lesson.videoUrl || lesson.videoEmbedUrl) && 
             (lesson.pptUrl || lesson.pptEmbedUrl) && 
             <hr className="my-4" />}
            
            {renderPPT()}

            {!lesson.videoUrl && !lesson.videoEmbedUrl && !lesson.pptUrl && !lesson.pptEmbedUrl && (
              <div className="text-center text-muted py-5">
                <i className="fas fa-folder-open fa-3x mb-3"></i>
                <h5>No Media Content</h5>
                <p>This lesson contains only text content.</p>
              </div>
            )}
          </Card.Body>

          <Card.Footer className="d-flex justify-content-between align-items-center">
            <div className="lesson-info">
              <small className="text-muted">
                <i className="fas fa-clock me-1"></i>
                Duration: {lesson.duration || 30} minutes
              </small>
            </div>
            <Button variant="primary" onClick={onClose}>
              <i className="fas fa-check me-2"></i>
              Mark as Complete
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default CourseContentViewer;