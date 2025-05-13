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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/Theme';
import './App.css'

function App() {
  // display
  const [view, setView] = useState("home")

  // settings
  const [difficulty, setDifficulty] = useState("easy")
  const [maxQuestions, setMaxQuestions] = useState(10)

  // categories
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

  const categoryNames = new Map([
    ["music", "Music"],
    ["sport_and_leisure", "Sport and leisure"],
    ["film_and_tv", "Film and TV"],
    ["arts_and_literature", "Arts and Literature"],
    ["history", "History"],
    ["society_and_culture", "Society and Culture"],
    ["science", "Science"],
    ["geography", "Geography"],
    ["food_and_drink", "Food and Drink"],
    ["general_knowledge", "General Knowledge"]
  ]);

  const [opponentCategories, setOpponentCategories] = useState([])

  // questions
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // points
  const [opponentAnswer, setOpponentAnswer] = useState("")

  const [playerPoints, setPlayerPoints] = useState(0)
  const [opponentPoints, setOpponentPoints] = useState(0)

  //lifelines
  const [skipAvailable, setSkipAvailable] = useState(true)
  const [hintAvailable, setHintAvailable] = useState(true)
  const [hintMessage, setHintMessage] = useState("")
  const [removeTwoAvailable, setRemoveTwoAvailable] = useState(true)
  const [removeTwoUsed, setRemoveTwoUsed] = useState(false)

  // messages
  const [answerCorrect, setAnswerCorrect] = useState("")
  const [answerMessage, setAnswerMessage] = useState("")

  const [resultsMessage, setResultsMessage] = useState("")

  // modals
  const [answerModalOpen, setAnswerModalOpen] = useState(false)
  const [hintModalOpen, setHintModalOpen] = useState(false)

  const resetGame = () => {
    setPlayerPoints(0)
    setOpponentPoints(0)
    setCurrentQuestion(0)
    setQuestions([])
    setDifficulty("easy")
    setMaxQuestions(10)
    setSkipAvailable(true)
    setHintAvailable(true)
    setRemoveTwoAvailable(true)
    setRemoveTwoUsed(false)
  }

  const handleMaxQuestionsChange = (e) => {
    setMaxQuestions(parseInt(e.target.value))
  }

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value)
  }

  // choosing opponent's strengths and weakness
  const shuffleCategories = () => {
    let shuffledCategories = categories
    shuffledCategories = shuffledCategories.sort(() => Math.random() - 0.5)
    setOpponentCategories([shuffledCategories[0], shuffledCategories[1], shuffledCategories[2]])
  }

  // fetch questions based on difficulty
  const fetchQuestions = () => {
    fetch(`https://the-trivia-api.com/v2/questions?limit=${maxQuestions}&difficulties=${difficulty}`)
      .then(response => response.json())
      .then(data => setQuestions(data))
  }

  // check if answer is correct and determine opponent's answer
  const checkAnswer = (answer) => {
    setRemoveTwoUsed(false)
    if (questions[currentQuestion].category == opponentCategories[0] || questions[currentQuestion].category == opponentCategories[1]) {
      setOpponentAnswer("Your opponent answered correctly and received 10 points.")
      setOpponentPoints(opponentPoints + 10)
    } else if (questions[currentQuestion].category == opponentCategories[2]) {
      setOpponentAnswer("Your opponent didn't know the answer.")
    } else {
      let random = Math.round(Math.random())
      if (random == 0) {
        setOpponentAnswer("Your opponent didn't know the answer.")
      } else {
        setOpponentAnswer("Your opponent answered correctly and received 10 points.")
        setOpponentPoints(opponentPoints + 10)
      }
    }

    if (answer == questions[currentQuestion].correctAnswer) {
      setAnswerCorrect("Correct!")
      setAnswerMessage("+10 points!")
      setPlayerPoints(playerPoints + 10)
      setAnswerModalOpen(true)
    } else {
      setAnswerCorrect("Incorrect!")
      setAnswerMessage(`The correct answer was ${questions[currentQuestion].correctAnswer}.`)
      setAnswerModalOpen(true)
    }
  }

  const handleAnswerModalClose = () => {
    setAnswerModalOpen(false)
    if (currentQuestion < (maxQuestions - 1)) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
      setView("results")
    }
  }

  const handleHintModalClose = () => {
    setHintModalOpen(false)
  }

  // randomly determine hint message
  const getHint = () => {
    let random = Math.floor(Math.random() * 3)
    if (removeTwoUsed) {
      if (random == 0) {
        setHintMessage(`The answer is probably ${questions[currentQuestion].incorrectAnswers[0]}.`)
      } else {
        setHintMessage(`The answer is probably ${questions[currentQuestion].correctAnswer}.`)
      }
    } else {
      if (random == 0) {
        setHintMessage(`The answer is probably ${questions[currentQuestion].incorrectAnswers[0]}. Or maybe ${questions[currentQuestion].correctAnswer}...`)
      } else if (random == 1) {
        setHintMessage(`The answer is probably ${questions[currentQuestion].correctAnswer}. Or maybe ${questions[currentQuestion].incorrectAnswers[0]}...`)
      } else {
        setHintMessage(`The answer is probably ${questions[currentQuestion].incorrectAnswers[0]}. Or maybe ${questions[currentQuestion].incorrectAnswers[1]}...`)
      }
    }
  }

  const skipQuestion = () => {
    if (currentQuestion < (maxQuestions - 1)) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
      setView("results")
    }
  }

  // display message depending on results
  const calculateResults = () => {
    if (playerPoints > opponentPoints) {
      setResultsMessage("Congratulations!")
    } else if (playerPoints == opponentPoints) {
      setResultsMessage("It's a tie!")
    } else {
      setResultsMessage("Better luck next time!")
    }
  }

  //buttons for lifelines
  const SkipButton = () => {
    if (skipAvailable) {
      return <Button variant="contained" color='melon' onClick={() => {
        setSkipAvailable(false)
        skipQuestion()
      }}>Skip</Button>
    } else {
      return <Button variant="contained" disabled>Skip</Button>
    }
  }

  const HintButton = () => {
    if (hintAvailable) {
      return <Button variant="contained" color='melon' onClick={() => {
        setHintAvailable(false)
        getHint()
        setHintModalOpen(true)
      }}>Hint</Button>
    } else {
      return <Button variant="contained" disabled>Hint</Button>
    }
  }

  const RemoveTwoButton = () => {
    if (removeTwoAvailable) {
      return <Button variant="contained" color='melon' onClick={() => {
        setRemoveTwoAvailable(false)
        setRemoveTwoUsed(true)
      }}>50/50</Button>
    } else {
      return <Button variant="contained" disabled>50/50</Button>
    }
  }

  // shuffles answers and returns buttons
  const AnswerButtons = () => {
    let allAnswers = []
    if (!removeTwoUsed) {
      allAnswers.push(questions[currentQuestion].incorrectAnswers[0])
      allAnswers.push(questions[currentQuestion].incorrectAnswers[1])
      allAnswers.push(questions[currentQuestion].incorrectAnswers[2])
      allAnswers.push(questions[currentQuestion].correctAnswer)
      allAnswers = allAnswers.sort(() => Math.random() - 0.5)

      return (
        <Grid container spacing={2} sx={{
          marginX: { xs: '10%', md: '25%' }
        }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="contained" size='large' color='tiffany' onClick={() => { checkAnswer(allAnswers[0]) }}>{allAnswers[0]}</Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="contained" size='large' color='tiffany' onClick={() => { checkAnswer(allAnswers[1]) }}>{allAnswers[1]}</Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="contained" size='large' color='tiffany' onClick={() => { checkAnswer(allAnswers[2]) }}>{allAnswers[2]}</Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="contained" size='large' color='tiffany' onClick={() => { checkAnswer(allAnswers[3]) }}>{allAnswers[3]}</Button>
          </Grid>
        </Grid>
      )

    } else {
      allAnswers.push(questions[currentQuestion].incorrectAnswers[0])
      allAnswers.push(questions[currentQuestion].correctAnswer)
      allAnswers = allAnswers.sort(() => Math.random() - 0.5)

      return (
        <Grid container spacing={2} sx={{
          marginX: { xs: '10%', md: '25%' }
        }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="contained" size='large' color='tiffany' onClick={() => { checkAnswer(allAnswers[0]) }}>{allAnswers[0]}</Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button variant="contained" size='large' color='tiffany' onClick={() => { checkAnswer(allAnswers[1]) }}>{allAnswers[1]}</Button>
          </Grid>
        </Grid>
      )
    }
  }

  // home page
  if (view == "home") {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <AppBar position="fixed" elevation={0} color='violet'>
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Trivia Duel
              </Typography>
            </Toolbar>

          </AppBar>
          <Toolbar />
          <Grid container
            spacing={2} sx={{
              marginX: '5%'
            }}
          >
            <Grid size={12}>
              <Typography sx={{ typography: { xs: 'h4', md: 'h2' } }}>Welcome!</Typography>
            </Grid>
            <Grid size={12}>
              <Button variant="contained" size='large' color='raspberry' onClick={() => {
                setView("settings")
              }}>New Game</Button>
            </Grid>
            <Grid size={12}>
              <Typography sx={{ typography: { xs: 'h5', md: 'h4' } }}>How to Play:</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                bgcolor='tiffany.light'
                sx={{
                  borderRadius: 2,
                  padding: '3%',
                  marginX:
                  {
                    xs: '2%',
                    md: '10%'
                  },
                  marginBottom: {
                    xs: '2%',
                    md: '1%'
                  },
                }}>
                <Typography marginBottom={'5%'}>The goal of the game is to score points by correctly answering trivia questions from various categories.</Typography>
                <Typography marginBottom={'5%'}>Before starting the game, you can choose the number of questions and the difficulty level.</Typography>
                <Typography>The game will then generate an opponent with certain strengths and weaknesses. Be sure to remember them!</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                bgcolor='melon.light'
                sx={{
                  borderRadius: 2,
                  padding: '3%',
                  marginX:
                  {
                    xs: '2%',
                    md: '10%'
                  },
                  marginBottom: {
                    xs: '2%',
                    md: '1%'
                  },
                }}>
                <Typography marginBottom={'5%'}>When playing the game, click on the answer you think is correct.</Typography>
                <Typography marginBottom={'5%'}>You also have three lifelines you can use if you're faced with a difficult question.
                  The lifelines will let you skip a question, get a hint, or eliminate two wrong answers.
                  However, you can use each of them only once per game, so choose wisely.</Typography>
                <Typography marginBottom={'5%'}>Try to score more points than your opponent to win the game!</Typography>
                <Typography>Questions are fetched from <a href='https://the-trivia-api.com/'>The Trivia API</a></Typography>
              </Box>
            </Grid>
          </Grid>
        </div >
      </ThemeProvider>
    )
  }

  // settings page
  else if (view == "settings") {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <AppBar position="fixed" elevation={0} color='violet'>
            <Toolbar>
              <IconButton
                size="large"
                color="inherit"
                aria-label="back"
                onClick={() => {
                  resetGame()
                  setView("home")
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Trivia Duel
              </Typography>
              <IconButton aria-label="back" size='large' disabled
                sx={{
                  "&.Mui-disabled": {
                    color: '#462255'
                  }
                }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Toolbar>

          </AppBar>
          <Toolbar />
          <Grid container
            spacing={2} sx={{
              marginX: { xs: '2%', md: '30%' }
            }}
          >
            <Grid size={12}>
              <Typography sx={{ typography: { xs: 'h5', md: 'h4' } }}>Settings</Typography>
            </Grid>
            <Grid size={6}>
              <FormControl color='raspberry'>
                <FormLabel id="max-questions-selection" sx={{ textAlign: 'left' }}>No. of Questions</FormLabel>
                <RadioGroup
                  aria-labelledby="max-questions-selection"
                  defaultValue="10"
                  name="radio-buttons-group"
                  onChange={handleMaxQuestionsChange}
                >
                  <FormControlLabel value="10" control={<Radio color='raspberry' />} label="10" />
                  <FormControlLabel value="15" control={<Radio color='raspberry' />} label="15" />
                  <FormControlLabel value="20" control={<Radio color='raspberry' />} label="20" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl color='raspberry'>
                <FormLabel id="difficulty-selection" sx={{ textAlign: 'left' }}>Difficulty</FormLabel>
                <RadioGroup
                  aria-labelledby="difficulty-selection"
                  defaultValue="easy"
                  name="radio-buttons-group"
                  onChange={handleDifficultyChange}
                >
                  <FormControlLabel value="easy" control={<Radio color='raspberry' />} label="Easy" />
                  <FormControlLabel value="medium" control={<Radio color='raspberry' />} label="Medium" />
                  <FormControlLabel value="hard" control={<Radio color='raspberry' />} label="Hard" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Button variant="contained" color='raspberry' onClick={() => {
                fetchQuestions()
                shuffleCategories()
                setView("confirm")
              }}>Continue</Button>
            </Grid>
          </Grid>

        </div >
      </ThemeProvider>
    )
  }

  // opponent view
  else if (view == "confirm") {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <AppBar position="fixed" elevation={0} color='violet'>
            <Toolbar>
              <IconButton
                size="large"
                color="inherit"
                aria-label="back"
                onClick={() => {
                  resetGame()
                  setView("home")
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Trivia Duel
              </Typography>
              <IconButton aria-label="back" size='large' disabled
                sx={{
                  "&.Mui-disabled": {
                    color: '#462255'
                  }
                }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Toolbar>

          </AppBar>
          <Toolbar />
          <Grid container
            spacing={2} sx={{
              marginX: { xs: '2%', md: '10%' }
            }}
          >
            <Grid size={12}>
              <Typography sx={{ typography: { xs: 'h5', md: 'h4' } }}>Opponent</Typography>
            </Grid>
            <Grid size={6}>
              <Typography sx={{ typography: { xs: 'h6', md: 'h5' } }}>Strengths</Typography>
              <Box sx={{
                bgcolor: 'tiffany.light',
                borderRadius: 2,
                marginX:
                {
                  xs: '2%',
                  md: '20%'
                },
                marginY: {
                  xs: '10%',
                  md: '5%'
                },
                padding: '5%'
              }}>
                <Typography>{categoryNames.get(opponentCategories[0])}</Typography>
              </Box>
              <Box sx={{
                bgcolor: 'tiffany.light',
                borderRadius: 2,
                marginX:
                {
                  xs: '2%',
                  md: '20%'
                },
                marginY: {
                  xs: '10%',
                  md: '5%'
                },
                padding: '5%'
              }}>
                <Typography>{categoryNames.get(opponentCategories[1])}</Typography>
              </Box>
            </Grid>
            <Grid size={6}>
              <Typography sx={{ typography: { xs: 'h6', md: 'h5' } }}>Weakness</Typography>
              <Box sx={{
                bgcolor: 'melon.light',
                borderRadius: 2,
                marginX:
                {
                  xs: '2%',
                  md: '20%'
                },
                marginY: {
                  xs: '10%',
                  md: '5%'
                },
                padding: '5%'
              }}>
                <Typography>{categoryNames.get(opponentCategories[2])}</Typography>
              </Box>
            </Grid>
            <Grid size={12}>
              <Button variant="contained" color='raspberry' onClick={() => {
                setView("game")
              }}>Start</Button>
            </Grid>
          </Grid>
        </div >
      </ThemeProvider>
    )
  }

  // game view
  else if (view == "game") {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <AppBar position="fixed" elevation={0} color='violet'>
            <Toolbar>
              <IconButton
                size="large"
                color="inherit"
                aria-label="back"
                onClick={() => {
                  resetGame()
                  setView("home")
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Question {currentQuestion + 1}/{maxQuestions}
              </Typography>
              <IconButton aria-label="back" size='large' disabled
                sx={{
                  "&.Mui-disabled": {
                    color: '#462255'
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
              <Stack direction="row" spacing={2}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <SkipButton />
                <HintButton />
                <RemoveTwoButton />
              </Stack>
            </Grid>
            <Grid size={12}>
              <Box sx={{
                bgcolor: 'tiffany.light',
                borderRadius: 2,
                marginX:
                {
                  xs: '2%',
                  md: '20%'
                },
                marginBottom: {
                  xs: '3%',
                  md: '1%'
                },
                padding: {
                  xs: '2%',
                  md: '1%'
                }
              }}>
                <Typography variant='subtitle2'>Category</Typography>
                <Typography variant='subtitle1'>{categoryNames.get(questions[currentQuestion].category)}</Typography>
                <Typography variant='h6'>{questions[currentQuestion].question.text}</Typography>
              </Box>
              <Modal
                open={hintModalOpen}
                onClose={handleHintModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '50%', md: '25%' },
                  bgcolor: 'purple.light',
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4,
                }}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Hint
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {hintMessage}
                  </Typography>
                </Box>
              </Modal>
              <Modal
                open={answerModalOpen}
                onClose={handleAnswerModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={{
                  position: 'absolute',
                  top: { xs: '60%', md: '50%' },
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '50%', md: '25%' },
                  bgcolor: 'purple.light',
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
          </Grid>
          <AnswerButtons />
        </div >
      </ThemeProvider>
    )
  }

  // results page
  else if (view == "results") {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <AppBar position="fixed" elevation={0} color='violet'>
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Trivia Duel
              </Typography>
            </Toolbar>

          </AppBar>
          <Toolbar />
          <Grid container
            spacing={2}
            sx={{
              marginX: { xs: '10%', md: '25%' },
              marginY: '1%'
            }}
          >
            <Grid size={12}>
              <Typography sx={{ typography: { xs: 'h4', md: 'h2' } }}>{resultsMessage}</Typography>
            </Grid>
            <Grid size={12}>
              <Typography sx={{ typography: { xs: 'h5', md: 'h4' } }}>Your score: {playerPoints} points</Typography>
            </Grid>
            <Grid size={12}>
              <Typography sx={{ typography: { xs: 'h5', md: 'h4' } }}>Opponent's score: {opponentPoints} points</Typography>
            </Grid>
            <Grid size={6}>
              <Button variant="contained" color='melon' onClick={() => {
                resetGame()
                setView("home")
              }}>Home</Button>
            </Grid>
            <Grid size={6}>
              <Button variant="contained" color='tiffany' onClick={() => {
                resetGame()
                setView("settings")
              }}>New Game</Button>
            </Grid>
          </Grid>
        </div >
      </ThemeProvider>
    )
  }
}

export default App
