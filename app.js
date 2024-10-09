const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files like CSS
app.use(express.static('public'));

// Homepage route
app.get('/', (req, res) => {
  res.render('index', { joke: null, name: null, error: null });
});

// Route to handle joke request
app.get('/getJoke', async (req, res) => {
  const name = req.query.name || 'User'; // Default name to 'User' if no name is provided

  try {
    // Call JokeAPI to get a random joke
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
    const jokeData = response.data;

    let joke = '';
    // Check if the joke is a single type or a two-part joke
    if (jokeData.type === 'single') {
      joke = jokeData.joke;
    } else if (jokeData.type === 'twopart') {
      joke = `${jokeData.setup} ... ${jokeData.delivery}`;
    }

    // Personalize the joke by inserting the user's name where appropriate
    // Optionally replace "Chuck Norris" with the user's name for fun
    const personalizedJoke = joke.replace(/Chuck Norris/gi, name);

    // Render the page with the personalized joke
    res.render('index', { joke: personalizedJoke, name: name, error: null });
  } catch (error) {
    console.error(error);
    res.render('index', { joke: null, name: null, error: 'Error fetching joke.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

