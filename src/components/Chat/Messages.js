import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import { FaCheck } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa6";
import styled from "styled-components";

const Messages = ({ text, send, sender, timestamp, type, is_read }) => {
  const isSender = send === sender;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <MessageContainer className="mb-2" isSender={isSender}>
      <Row
        className={`mb-2 ${
          isSender ? "justify-content-end ml-10" : "mr-10 justify-content-start"
        }`}
      >
        <Col
          xs={10}
          md={7}
          className={`p-3 rounded-pill shadow-sm ${
            isSender ? "bg-slate-100" : "bg-slate-300 text-black"
          } font-weight-bold`}
          style={{ position: "relative", borderRadius: "25px" }}
        >
          {type === "photo" ? (
            <StyledImage
              src={`https://res.cloudinary.com/dvraiunbw/${text}`}
              alt="Group text"
              onClick={handleImageClick}
            />
          ) : type === "video" ? (
            <StyledVideo src={text} alt="Group video" controls />
          ) : (
            <span>{text}</span>
          )}
        </Col>

        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={closeModal}>Close</CloseButton>
              <FullscreenImage
                src={`https://res.cloudinary.com/dvraiunbw/${text}`}
                alt="Group message"
              />
            </ModalContent>
          </ModalOverlay>
        )}
      </Row>
      {/* Display the time in the bottom-right corner */}
      <p
        style={{
          padding: "10px",
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "4px", // Adjust the gap between the icon and time if needed
          color: "#555",
        }}
      >
        {isSender && (!is_read ? <FaCheck /> : <FaCheckDouble />)}
        {moment(timestamp).format("HH:mm")}
      </p>
    </MessageContainer>
  );
};

export default Messages;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 3px;
  padding-${({ isSender }) => (isSender ? "right" : "left")}:7px; 
  justify-content: ${({ isSender }) =>
    isSender
      ? "flex-end"
      : "flex-start"}; // Align messages to right or left based on sender
`;


const StyledImage = styled.img`
  max-width: 150px; /* Adjust the maximum width as per your preference */
  max-height: 160px; /* Adjust the maximum height as per your preference */
  margin: 0 10px;
  width: auto;
  border-radius: 5px;
  height: auto;
`;

const StyledVideo = styled.video`
  max-width: 250px; /* Adjust the maximum width as per your preference */
  max-height: 200px; /* Adjust the maximum height as per your preference */
  margin: 0 10px;
  width: auto;
  border-radius: 5px;
  height: auto;
  z-index: 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
`;

const FullscreenImage = styled.img`
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border: none;
  cursor: pointer;
  /* Other styles for the close button */
`;
