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
            <Button variant="contained" startIcon={<BarChartIcon />}>
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
      </Box>
    </motion.div>
  );
}
