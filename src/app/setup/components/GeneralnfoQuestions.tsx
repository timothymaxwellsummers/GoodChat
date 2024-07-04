import React from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { saveProfileData } from "@/app/services/localStorageService";

interface QuestionGroup {
  label: string;
  questions: string[];
}

const questions: QuestionGroup[] = [
  {
    label: "General information:",
    questions: ["Name, Surname", "Current profession", "Learned profession"],
  },
  {
    label: "Current situation:",
    questions: [
      "Describe your current problem:",
      "First occurance of problem and development until now:",
      "Estimate severance of your problem:",
      "Who did you ask for help so far?",
      "Are you being treated by a therapist?",
      "Are you taking any medication?",
      "How much alcohol do you consume a day? (in liters)",
      "How many cigarettes do you smoke a day?",
    ],
  },
  {
    label: "Biography",
    questions: [
      "I experienced my childhood as...",
      "Sickness/Injuries during lifetime",
      "School graduation",
      "How was your contact to other school students?",
      "Did you have many friends?",
      "Were you satisfied with your performance in school?",
      "Father's job:",
      "Father's health state:",
      "Mother's job:",
      "Mother's health state:",
      "Relationship to siblings",
      "Describe your relationship with your parents:",
      "Who are the most important people in your life?",
    ],
  },
  {
    label: "Job",
    questions: [
      "Do you perceive your current job as satisfying?",
      "Are you satisfied with your income?",
      "Are there any bigger financial problems?",
      "Do you feel overwhelmed by your tasks?",
    ],
  },
  {
    label: "Analyzing the problem:",
    questions: [
      "What could be the origin of your problem?",
      "When and where do your problems not occur at all or rarely?",
      "How does your body react, when you experience your problem?",
      "What helps you in managing with your problem?",
    ],
  },
];

const GeneralInfoQuestions: React.FC = () => {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formEntries: Record<string, string> = {};
    formData.forEach((value, key) => {
      formEntries[key] = value as string;
    });

    const profileData = questions.map((section) => ({
      label: section.label,
      questions: section.questions.map((question) => ({
        question,
        answer: formEntries[question] || "",
      })),
    }));

    saveProfileData(JSON.stringify(profileData, null, 2));
    console.log("Profile Data:", profileData);
    router.push("/");
  };

  const renderInputField = (question: string) => {
    switch (question) {
      case "Are you being treated by a therapist?":
      case "Are you taking any medication?":
      case "Do you perceive your current job as satisfying?":
      case "Are you satisfied with your income?":
      case "Are there any bigger financial problems?":
      case "Do you feel overwhelmed by your tasks?":
        return (
          <FormControl component="fieldset">
            <FormLabel>{question}</FormLabel>
            <RadioGroup row name={question}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        );
      case "How much alcohol do you consume a day? (in liters)":
      case "How many cigarettes do you smoke a day?":
        return (
          <TextField
            fullWidth
            type="number"
            label={question}
            name={question}
            variant="outlined"
          />
        );
      case "Estimate severance of your problem:":
        return (
          <FormControl fullWidth>
            <InputLabel>{question}</InputLabel>
            <Select name={question} label={question}>
              <MenuItem value="mild">Mild</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="severe">Severe</MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return (
          <TextField
            fullWidth
            label={question}
            name={question}
            variant="outlined"
            multiline={question.includes("Describe")}
            rows={3}
          />
        );
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        General Questions
      </Typography>
      <form onSubmit={handleSubmit}>
        {questions.map((section, index) => (
          <Box key={index} mb={4}>
            <Typography variant="h6" component="h2" gutterBottom>
              {section.label}
            </Typography>
            <Grid container spacing={2}>
              {section.questions.map((question, idx) => (
                <Grid item xs={12} key={idx}>
                  {renderInputField(question)}
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
        <Box mt={4}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default GeneralInfoQuestions;
