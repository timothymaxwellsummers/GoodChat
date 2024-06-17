// GAD7Form.tsx
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Paper,
} from "@mui/material";

export interface QAObject {
  [key: string]: string | number;
}

interface Props {
  onSubmit: (responseObject: QAObject, score: number) => void;
  score: (score: number) => void;
}

const GAD7Form: React.FC<Props> = ({ onSubmit, score }) => {
  const questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
  ];

  const options = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" },
  ];

  const [responses, setResponses] = useState<number[]>(
    new Array(questions.length).fill(0)
  );

  const handleChange = (index: number, value: number) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const responseObject = createResponseObject(questions, responses);
    const totalScore = responses.reduce((a, b) => a + b, 0);
    console.log("Score", totalScore);
    console.log("Response", responseObject);
    score(totalScore);
    onSubmit(responseObject, totalScore); // Pass responseObject and score to parent component
  };

  const createResponseObject = (
    questions: string[],
    answers: number[]
  ): QAObject => {
    if (questions.length !== answers.length) {
      throw new Error(
        "The length of questions and answers arrays must be the same."
      );
    }

    let qaObject: QAObject = {};

    for (let i = 0; i < questions.length; i++) {
      qaObject[questions[i]] = answers[i];
    }

    return qaObject;
  };

  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          GAD-7 Questionnaire
        </Typography>
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <Box key={index} mb={2}>
              <Typography variant="body1" fontWeight={"bold"} gutterBottom>
                {question}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name={`question-${index}`}
                  value={responses[index]}
                  onChange={(event) =>
                    handleChange(index, parseInt(event.target.value))
                  }
                >
                  {options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default GAD7Form;
