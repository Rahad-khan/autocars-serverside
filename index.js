const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Midware

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("wearhouse is active")
});

app.listen(port,() => {
    console.log("listening from port ", port)
})