import { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TimerIcon from '@mui/icons-material/Timer';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import './App.css'

function App() {
  const [view, setView] = useState("home")

  const [difficulty, setDifficulty] = useState("easy")

  const categories = [
    "music",
    "sport_and_leisure",
    "film_and_tv",
    "arts_and_literature",
    "history",
    "society_and_culture",
    "science",
    "geography",
    "food_and_drink",
    "general_knowledge"
  ]

  const [opponentCategories, setOpponentCategories] = useState([])

  const [questions, setQuestions] = useState([])

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const [opponentAnswer, setOpponentAnswer] = useState("")

  const [playerPoints, setPlayerPoints] = useState(0)
  const [opponentPoints, setOpponentPoints] = useState(0)

  const [answerCorrect, setAnswerCorrect] = useState("")
  const [answerMessage, setAnswerMessage] = useState("")

  const [answerModalOpen, setAnswerModalOpen] = useState(false)

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value)
  }

  const shuffleCategories = () => {
    let shuffledCategories = categories
    shuffledCategories = shuffledCategories.sort(() => Math.random() - 0.5)
    setOpponentCategories([shuffledCategories[0], shuffledCategories[1], shuffledCategories[2]])
  }

  const fetchQuestions = () => {
    fetch(`https://the-trivia-api.com/v2/questions?limit=20&difficulties=${difficulty}`)
      .then(response => response.json())
      .then(data => setQuestions(data))
  }

  const checkAnswer = (answer) => {
    if (questions[currentQuestion].category == opponentCategories[0] || questions[currentQuestion].category == opponentCategories[1]) {
      setOpponentAnswer("Your opponent answered correctly and received 10 points.")
      setOpponentPoints(opponentPoints + 10)
    } else if (questions[currentQuestion].category == opponentCategories[2]) {
      setOpponentAnswer("Your opponent didn't know the answer")
    } else {
      let random = Math.round(Math.random())
      if (random == 0) {
        setOpponentAnswer("Your opponent didn't know the answer")
      } else {
        setOpponentAnswer("Your opponent answered correctly and received 10 points.")
        setOpponentPoints(opponentPoints + 10)
      }
    }

    if (answer == questions[currentQuestion].correctAnswer) {
      setAnswerCorrect("Correct!")
      setAnswerMessage("+10 points")
      setPlayerPoints(playerPoints + 10)
      setAnswerModalOpen(true)
    } else {
      setAnswerCorrect("Incorrect!")
      setAnswerMessage("The correct answer was " + questions[currentQuestion].correctAnswer)
      setAnswerModalOpen(true)
    }
  }

  const handleAnswerModalClose = () => {
    setAnswerModalOpen(false)
    if (currentQuestion < 19) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setView("results")
    }
  }

  const AnswerButtons = () => {
    let allAnswers = []
    allAnswers.push(questions[currentQuestion].incorrectAnswers[0])
    allAnswers.push(questions[currentQuestion].incorrectAnswers[1])
    allAnswers.push(questions[currentQuestion].incorrectAnswers[2])
    allAnswers.push(questions[currentQuestion].correctAnswer)
    allAnswers = allAnswers.sort(() => Math.random() - 0.5)

    return (
      <Grid container spacing={2} sx={{
        marginX: { xs: '10%', md: '33%' }
      }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="contained" size='large' onClick={() => { checkAnswer(allAnswers[0]) }}>{allAnswers[0]}</Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="contained" size='large' onClick={() => { checkAnswer(allAnswers[1]) }}>{allAnswers[1]}</Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="contained" size='large' onClick={() => { checkAnswer(allAnswers[2]) }}>{allAnswers[2]}</Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="contained" size='large' onClick={() => { checkAnswer(allAnswers[3]) }}>{allAnswers[3]}</Button>
        </Grid>
      </Grid>
    )
  }

  if (view == "home") {
    return (
      <>
        <div>
          <AppBar position="fixed" elevation={0}>
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Home
              </Typography>
            </Toolbar>

          </AppBar>
          <Toolbar />
          <FormControl>
            <FormLabel id="difficulty-radio-buttons-group-label">Difficulty</FormLabel>
            <RadioGroup
              aria-labelledby="difficulty-radio-buttons-group-label"
              defaultValue="easy"
              name="radio-buttons-group"
              onChange={handleDifficultyChange}
            >
              <FormControlLabel value="easy" control={<Radio />} label="Easy" />
              <FormControlLabel value="medium" control={<Radio />} label="Medium" />
              <FormControlLabel value="hard" control={<Radio />} label="Hard" />
            </RadioGroup>
          </FormControl>
          <Button variant="contained" onClick={() => {
            fetchQuestions()
            shuffleCategories()
            setView("confirm")
          }}>Continue</Button>
        </div >
      </>
    )
  }

  else if (view == "confirm") {
    return (
      <>
        <div>
          <AppBar position="fixed" elevation={0}>
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Home
              </Typography>
            </Toolbar>

          </AppBar>
          <Toolbar />
          <Typography>Opponent</Typography>
          <Typography>Strengths: {opponentCategories[0].replace(/_/g, " ")}, {opponentCategories[1].replace(/_/g, " ")}</Typography>
          <Typography>Weakness: {opponentCategories[2].replace(/_/g, " ")}</Typography>
          <Button variant="contained" onClick={() => {
            setView("game")
          }}>Start</Button>
        </div >
      </>
    )
  }

  else if (view == "game") {
    return (
      <>
        <div>
          <AppBar position="fixed" elevation={0}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="back"
                onClick={() => {
                  setPlayerPoints(0)
                  setOpponentPoints(0)
                  setCurrentQuestion(0)
                  setQuestions([])
                  setDifficulty("easy")
                  setView("home")
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Question {currentQuestion + 1}/20
              </Typography>
              <IconButton aria-label="back" disabled
                sx={{
                  "&.Mui-disabled": {
                    color: "#1976d2"
                  }
                }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Toolbar>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ justifyItems: 'left' }}>
                <Typography variant='h5'>Player</Typography>
                <Typography variant='h6'>{playerPoints}</Typography>
              </Box>
              <Box sx={{ justifyItems: 'right' }}>
                <Typography variant='h5'>Opponent</Typography>
                <Typography variant='h6'>{opponentPoints}</Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Toolbar />
          <Grid container
            spacing={2}
          >
            <Grid size={12}>
              <Box>
                <TimerIcon />
                <Typography>30</Typography>
              </Box>
            </Grid>
            <Grid size={12}>
              <Stack direction="row" spacing={2}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Button variant="outlined">SKIP</Button>
                <Button variant="outlined">HINT</Button>
                <Button variant="outlined">50/50</Button>
              </Stack>
            </Grid>
            <Grid size={12}>
              <Box sx={{
                border: 1,
                marginX:
                {
                  xs: '2%',
                  md: '20%'
                }
              }}>
                <Typography variant='subtitle2'>Category</Typography>
                <Typography variant='subtitle1'>{questions[currentQuestion].category.replace(/_/g, " ")}</Typography>
                <Typography variant='h6'>{questions[currentQuestion].question.text}</Typography>
              </Box>
              <Modal
                open={answerModalOpen}
                onClose={handleAnswerModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '50%', md: '25%' },
                  bgcolor: 'background.paper',
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4,
                }}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    {answerCorrect}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {answerMessage}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {opponentAnswer}
                  </Typography>
                </Box>
              </Modal>
            </Grid>
            <AnswerButtons />
          </Grid>
        </div >
      </>
    )
  } else if (view == "results") {
    return (
      <>
        <div>
          <AppBar position="fixed" elevation={0}>
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Results
              </Typography>
            </Toolbar>

          </AppBar>
          <Toolbar />
          <Typography>The end!</Typography>
          <Typography>You received {playerPoints} points</Typography>
          <Typography>Your opponent received {opponentPoints} points</Typography>
          <Button variant="contained" onClick={() => {
            setPlayerPoints(0)
            setOpponentPoints(0)
            setCurrentQuestion(0)
            setQuestions([])
            setDifficulty("easy")
            setView("home")
          }}>New Game</Button>
        </div >
      </>
    )
  }
}

export default App
