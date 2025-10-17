import React from 'react';
import { Card } from 'react-bootstrap';

export default function Services() {
  const services = [
    {
      icon: 'fas fa-users',
      title: 'Teacher Training Programs',
      description: 'Comprehensive professional development for educators in robotics, coding, and STEM methodologies',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      features: ['Hands-on Workshops', 'Curriculum Development', 'Assessment Strategies', 'Ongoing Support']
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Student Competition Training',
      description: 'Expert coaching for robotics competitions including WRO, FTC, VEX V5, WSRO, iCode, and CodeAvour',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      features: ['Competition Prep', 'Team Building', 'Technical Skills', 'Strategic Planning']
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Curriculum Implementation',
      description: 'Complete STEM curriculum solutions from basic electronics to advanced robotics and AI',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      features: ['Age-Appropriate Content', 'Project-Based Learning', 'Resource Materials', 'Progress Tracking']
    },
    {
      icon: 'fas fa-rocket',
      title: 'School Partnership Programs',
      description: 'Customized STEM programs designed for schools with continuous support and resources',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      features: ['Custom Solutions', 'Equipment Setup', 'Faculty Training', 'Student Workshops']
    }
  ];

  return (
    <section id="services" className="py-5" style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
      <div className="container">
        <div className="text-center mb-5">
          <div className="mb-4">
            <span className="badge badge-pill badge-primary px-4 py-2" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '1.1em'}}>
              <i className="fas fa-cogs mr-2"></i>Our Services
            </span>
          </div>
          <h2 className="display-4 font-weight-bold text-dark mb-3" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>
            Comprehensive STEM Solutions
          </h2>
          <p className="lead text-muted" style={{maxWidth: '600px', margin: '0 auto'}}>
            From teacher training to student competition coaching, we provide end-to-end STEM education services
          </p>
        </div>

        <div className="row">
          {services.map((service, index) => (
            <div key={index} className="col-lg-6 col-md-6 mb-4">
              <Card className="h-100 border-0 position-relative overflow-hidden" style={{
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                background: `linear-gradient(135deg, ${service.gradient.replace('linear-gradient(135deg, ', '').replace(' 100%)', ', 0.08) 0%, ').replace(' 0%, ', ', 0.08) 0%, ')} 100%)`,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div className="card-ribbon" style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: service.gradient,
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '0.8em',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}>
                  Featured
                </div>
                <Card.Body className="text-center p-5 position-relative">
                  <div className="icon-container mx-auto mb-4" style={{
                    width: '100px',
                    height: '100px',
                    background: service.gradient,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <i className={`${service.icon} fa-3x text-white`}></i>
                  </div>
                  <Card.Title className="h4 font-weight-bold text-dark mb-3" style={{fontSize: '1.5em'}}>
                    {service.title}
                  </Card.Title>
                  <Card.Text className="text-muted mb-4" style={{fontSize: '1.1em', lineHeight: '1.6'}}>
                    {service.description}
                  </Card.Text>
                  <ul className="list-unstyled text-left" style={{paddingLeft: '20px'}}>
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="mb-3 d-flex align-items-center">
                        <div className="feature-icon mr-3" style={{
                          width: '20px',
                          height: '20px',
                          background: service.gradient,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <i className="fas fa-check text-white" style={{fontSize: '0.7em'}}></i>
                        </div>
                        <span className="text-dark font-weight-medium" style={{fontSize: '1em'}}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
                <style jsx>{`
                  .hover-shadow:hover {
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.2) !important;
                  }
                  .hover-shadow:hover .icon-container {
                    transform: scale(1.1);
                  }
                  .hover-shadow:hover .card-ribbon {
                    transform: scale(1.1);
                  }
                `}</style>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
