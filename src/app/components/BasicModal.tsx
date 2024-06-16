// BasicModal.tsx
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import GAD7Form, { QAObject } from "./Questionnaire";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
};

interface Props {
  onSubmit: (responseObject: QAObject) => void;
  score: (score: number) => void;
}

const BasicModal: React.FC<Props> = ({ onSubmit, score }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Questionnaire
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <GAD7Form onSubmit={onSubmit} onClose={handleClose} score={score} />
        </Box>
      </Modal>
    </div>
  );
};

export default BasicModal;
