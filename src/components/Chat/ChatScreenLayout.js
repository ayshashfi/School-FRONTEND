import React, { useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const ChatScreenLayout = () => {
  const userSelector = useSelector((state) => state.auth);
  const isAdmin = userSelector.is_admin;
  const isTeacher = userSelector.is_teacher;
  const isStudent = userSelector.is_student;
  const navigate = useNavigate();

  const handleBackButton = useCallback(() => {
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else if (isTeacher) {
      navigate('/teacher-dashboard');
    } else if (isStudent) {
      navigate('/teachers');
    } else {
      navigate('/');
    }
  }, [navigate, isAdmin, isTeacher, isStudent]);

  console.log(userSelector);

  return (
    <>
      <div className=''>
        <Row>
          <Col sm={1} className='d-flex'>
            {/* You can add content here if needed */}
          </Col>
          <Col sm={10}>
            <Button
              className='m-5 rounded-circle text-light text-3xl'
              variant=''
              onClick={handleBackButton}
            >
             
            <FaArrowAltCircleLeft />
            </Button>
            {/* Uncomment and replace with your logo */}
            {/* <img src={logo} className='mentor-nav-logo' alt='Logo' /> */}
          </Col>
          <Col sm={1} className='d-flex'>
            {/* You can add content here if needed */}
          </Col>
        </Row>
      </div>
      <Outlet />
    </>
  );
};

export default ChatScreenLayout;