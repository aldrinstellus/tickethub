import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ShortTextIcon from "@mui/icons-material/ShortText";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { PieChart, LineChart } from "@mui/x-charts";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'text' | 'multiple-choice' | 'single-choice' | 'nps';
  question: string;
  required: boolean;
  options?: string[];
}

interface NewSurvey {
  name: string;
  type: 'CSAT' | 'NPS' | 'Custom';
  description: string;
  trigger: 'manual' | 'post-resolution' | 'scheduled';
  questions: SurveyQuestion[];
}

export default function Surveys() {
  const [csatEnabled, setCsatEnabled] = React.useState(true);
  const [npsEnabled, setNpsEnabled] = React.useState(false);
  const [followUpEnabled, setFollowUpEnabled] = React.useState(true);

  // Survey creation state
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [newSurvey, setNewSurvey] = React.useState<NewSurvey>({
    name: '',
    type: 'Custom',
    description: '',
    trigger: 'manual',
    questions: []
  });
  const [editingQuestion, setEditingQuestion] = React.useState<SurveyQuestion | null>(null);
  const [questionDialogOpen, setQuestionDialogOpen] = React.useState(false);

  // Survey creation handlers
  const handleCreateSurvey = () => {
    setCreateDialogOpen(true);
    setCurrentStep(0);
    setNewSurvey({
      name: '',
      type: 'Custom',
      description: '',
      trigger: 'manual',
      questions: []
    });
  };

  const handleSurveyFieldChange = (field: keyof NewSurvey, value: any) => {
    setNewSurvey(prev => ({ ...prev, [field]: value }));
  };

  const handleAddQuestion = () => {
    setEditingQuestion({
      id: `q-${Date.now()}`,
      type: 'rating',
      question: '',
      required: false,
      options: []
    });
    setQuestionDialogOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;

    const updatedQuestions = [...newSurvey.questions];
    const existingIndex = updatedQuestions.findIndex(q => q.id === editingQuestion.id);

    if (existingIndex >= 0) {
      updatedQuestions[existingIndex] = editingQuestion;
    } else {
      updatedQuestions.push(editingQuestion);
    }

    setNewSurvey(prev => ({ ...prev, questions: updatedQuestions }));
    setQuestionDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setNewSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSaveSurvey = () => {
    // In a real app, this would save to the backend
    console.log('Saving survey:', newSurvey);
    setCreateDialogOpen(false);
    // Could add to surveyTemplates state here
  };

  const getQuestionTypeIcon = (type: SurveyQuestion['type']) => {
    switch (type) {
      case 'rating': return <StarIcon fontSize="small" />;
      case 'nps': return <ThumbUpIcon fontSize="small" />;
      case 'multiple-choice': return <CheckBoxIcon fontSize="small" />;
      case 'single-choice': return <RadioButtonCheckedIcon fontSize="small" />;
      case 'text': return <ShortTextIcon fontSize="small" />;
      default: return <ShortTextIcon fontSize="small" />;
    }
  };

  const surveyTemplates = [
    {
      id: 1,
      name: "CSAT - Post Resolution",
      type: "CSAT",
      status: "Active",
      responses: 1247,
      avgScore: 4.2,
      description: "Standard satisfaction survey sent after ticket resolution"
    },
    {
      id: 2,
      name: "NPS - Quarterly",
      type: "NPS",
      status: "Scheduled",
      responses: 0,
      avgScore: null,
      description: "Net Promoter Score survey sent quarterly to all customers"
    },
    {
      id: 3,
      name: "Feature Feedback",
      type: "Custom",
      status: "Draft",
      responses: 89,
      avgScore: 3.8,
      description: "Collect feedback on new features and improvements"
    }
  ];

  const csatData = [
    { label: '⭐', value: 2 },
    { label: '⭐⭐', value: 8 },
    { label: '⭐⭐⭐', value: 22 },
    { label: '⭐⭐⭐⭐', value: 45 },
    { label: '⭐⭐⭐⭐⭐', value: 23 },
  ];

  const responseData = [
    { name: 'Week 1', responses: 45 },
    { name: 'Week 2', responses: 52 },
    { name: 'Week 3', responses: 48 },
    { name: 'Week 4', responses: 61 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <PageHeader
              title="Surveys"
              subtitle="Collect feedback and measure customer satisfaction"
            />
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateSurvey}>
              Create Survey
            </Button>
          </Stack>
        </motion.div>

        {/* Survey Configuration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Survey Settings</Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch checked={csatEnabled} onChange={(e) => setCsatEnabled(e.target.checked)} />}
                  label="Automatic CSAT after ticket resolution"
                />
                <FormControlLabel
                  control={<Switch checked={npsEnabled} onChange={(e) => setNpsEnabled(e.target.checked)} />}
                  label="Quarterly NPS surveys"
                />
                <FormControlLabel
                  control={<Switch checked={followUpEnabled} onChange={(e) => setFollowUpEnabled(e.target.checked)} />}
                  label="Follow-up surveys for low scores"
                />
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Survey Templates */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Survey Templates</Typography>
                  <List>
                    <AnimatePresence>
                      {surveyTemplates.map((survey, index) => (
                        <motion.div
                          key={survey.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ListItem divider>
                            <ListItemText
                              primary={
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="subtitle1">{survey.name}</Typography>
                                  <Chip
                                    label={survey.status}
                                    size="small"
                                    color={survey.status === 'Active' ? 'success' : survey.status === 'Scheduled' ? 'warning' : 'default'}
                                  />
                                </Stack>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {survey.description}
                                  </Typography>
                                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <Typography variant="caption">
                                      Responses: {survey.responses}
                                    </Typography>
                                    {survey.avgScore && (
                                      <Typography variant="caption">
                                        Avg Score: {survey.avgScore}/5
                                      </Typography>
                                    )}
                                  </Stack>
                                </Box>
                              }
                              primaryTypographyProps={{ component: 'div' }}
                              secondaryTypographyProps={{ component: 'div' }}
                            />
                            <ListItemSecondaryAction>
                              <Stack direction="row" spacing={1}>
                                <IconButton edge="end" size="small">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton edge="end" size="small" color="error">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>CSAT Distribution</Typography>
                    <PieChart
                      series={[{ data: csatData }]}
                      height={250}
                      slotProps={{
                        legend: {
                          direction: 'column',
                          position: { vertical: 'middle', horizontal: 'right' },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Response Trends</Typography>
                    <LineChart
                      height={200}
                      series={[{ data: [45, 52, 48, 61], label: 'Responses' }]}
                      xAxis={[{ scaleType: 'point', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] }]}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Stack>
          </Grid>
        </Grid>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary">4.2</Typography>
                <Typography variant="body2" color="text.secondary">Avg CSAT</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="success.main">76%</Typography>
                <Typography variant="body2" color="text.secondary">Response Rate</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="warning.main">12</Typography>
                <Typography variant="body2" color="text.secondary">NPS Score</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="error.main">8</Typography>
                <Typography variant="body2" color="text.secondary">Low Scores</Typography>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Survey Creation Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Create New Survey
            <Typography variant="body2" color="text.secondary">
              Step {currentStep + 1} of 3
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ minHeight: 400 }}>
            {currentStep === 0 && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Survey Name"
                  value={newSurvey.name}
                  onChange={(e) => handleSurveyFieldChange('name', e.target.value)}
                  placeholder="e.g., Post-Support CSAT Survey"
                />

                <FormControl fullWidth>
                  <InputLabel>Survey Type</InputLabel>
                  <Select
                    value={newSurvey.type}
                    label="Survey Type"
                    onChange={(e) => handleSurveyFieldChange('type', e.target.value)}
                  >
                    <MenuItem value="CSAT">CSAT (Customer Satisfaction)</MenuItem>
                    <MenuItem value="NPS">NPS (Net Promoter Score)</MenuItem>
                    <MenuItem value="Custom">Custom Survey</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={newSurvey.description}
                  onChange={(e) => handleSurveyFieldChange('description', e.target.value)}
                  placeholder="Describe the purpose of this survey"
                />

                <FormControl fullWidth>
                  <InputLabel>Trigger</InputLabel>
                  <Select
                    value={newSurvey.trigger}
                    label="Trigger"
                    onChange={(e) => handleSurveyFieldChange('trigger', e.target.value)}
                  >
                    <MenuItem value="manual">Manual Send</MenuItem>
                    <MenuItem value="post-resolution">After Ticket Resolution</MenuItem>
                    <MenuItem value="scheduled">Scheduled (Recurring)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}

            {currentStep === 1 && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Survey Questions</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddQuestion}
                  >
                    Add Question
                  </Button>
                </Box>

                {newSurvey.questions.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No questions added yet. Click "Add Question" to get started.
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={2}>
                    {newSurvey.questions.map((question, index) => (
                      <Paper key={question.id} sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <DragIndicatorIcon color="action" sx={{ mt: 0.5 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                              {getQuestionTypeIcon(question.type)}
                              <Typography variant="subtitle2">
                                Question {index + 1}
                              </Typography>
                              <Chip size="small" label={question.type} />
                              {question.required && (
                                <Chip size="small" label="Required" color="error" />
                              )}
                            </Stack>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {question.question || 'No question text'}
                            </Typography>
                            {question.options && question.options.length > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                Options: {question.options.join(', ')}
                              </Typography>
                            )}
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingQuestion(question);
                                setQuestionDialogOpen(true);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Stack>
            )}

            {currentStep === 2 && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <Typography variant="h6">Survey Preview</Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {newSurvey.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {newSurvey.description}
                  </Typography>

                  <Stack spacing={3}>
                    {newSurvey.questions.map((question, index) => (
                      <Box key={question.id}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {index + 1}. {question.question}
                          {question.required && (
                            <Typography component="span" color="error.main"> *</Typography>
                          )}
                        </Typography>

                        {question.type === 'rating' && (
                          <Stack direction="row" spacing={1}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon key={star} color="action" />
                            ))}
                          </Stack>
                        )}

                        {question.type === 'nps' && (
                          <Stack direction="row" spacing={1}>
                            {Array.from({ length: 11 }, (_, i) => (
                              <Button key={i} variant="outlined" size="small">
                                {i}
                              </Button>
                            ))}
                          </Stack>
                        )}

                        {(question.type === 'multiple-choice' || question.type === 'single-choice') && (
                          <Stack spacing={1}>
                            {question.options?.map((option, optIndex) => (
                              <FormControlLabel
                                key={optIndex}
                                control={
                                  question.type === 'multiple-choice' ?
                                    <input type="checkbox" disabled /> :
                                    <input type="radio" disabled />
                                }
                                label={option}
                              />
                            ))}
                          </Stack>
                        )}

                        {question.type === 'text' && (
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Your answer here..."
                            disabled
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(prev => prev - 1)}>
                Back
              </Button>
            )}
            {currentStep < 2 ? (
              <Button
                variant="contained"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === 0 && !newSurvey.name.trim()}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSaveSurvey}
                disabled={newSurvey.questions.length === 0}
              >
                Create Survey
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Question Creation Dialog */}
        <Dialog open={questionDialogOpen} onClose={() => setQuestionDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingQuestion?.question ? 'Edit Question' : 'Add Question'}
          </DialogTitle>
          <DialogContent>
            {editingQuestion && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={editingQuestion.type}
                    label="Question Type"
                    onChange={(e) => setEditingQuestion(prev =>
                      prev ? { ...prev, type: e.target.value as SurveyQuestion['type'] } : null
                    )}
                  >
                    <MenuItem value="rating">5-Star Rating</MenuItem>
                    <MenuItem value="nps">NPS (0-10 Scale)</MenuItem>
                    <MenuItem value="single-choice">Single Choice</MenuItem>
                    <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                    <MenuItem value="text">Text Response</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Question Text"
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion(prev =>
                    prev ? { ...prev, question: e.target.value } : null
                  )}
                  placeholder="Enter your question here..."
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editingQuestion.required}
                      onChange={(e) => setEditingQuestion(prev =>
                        prev ? { ...prev, required: e.target.checked } : null
                      )}
                    />
                  }
                  label="Required question"
                />

                {(editingQuestion.type === 'single-choice' || editingQuestion.type === 'multiple-choice') && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Answer Options
                    </Typography>
                    <Stack spacing={2}>
                      {editingQuestion.options?.map((option, index) => (
                        <Stack key={index} direction="row" spacing={1} alignItems="center">
                          <TextField
                            fullWidth
                            size="small"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(editingQuestion.options || [])];
                              newOptions[index] = e.target.value;
                              setEditingQuestion(prev =>
                                prev ? { ...prev, options: newOptions } : null
                              );
                            }}
                            placeholder={`Option ${index + 1}`}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              const newOptions = editingQuestion.options?.filter((_, i) => i !== index) || [];
                              setEditingQuestion(prev =>
                                prev ? { ...prev, options: newOptions } : null
                              );
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          const newOptions = [...(editingQuestion.options || []), ''];
                          setEditingQuestion(prev =>
                            prev ? { ...prev, options: newOptions } : null
                          );
                        }}
                      >
                        Add Option
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQuestionDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveQuestion}
              disabled={!editingQuestion?.question.trim()}
            >
              Save Question
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
}
