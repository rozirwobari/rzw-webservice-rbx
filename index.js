const fs = require('fs');
const express = require("express");
const app = express();
const PORT = 3024;
app.use(express.json());
const JSON_FILE = 'data.json';
const TOKEN = "ypYW5fimv55hwEjLCc0dWahkc00eMZE88aDhjUgvzcwH4sJGXOThAvomEwQlVfAe";
function ReadJSONData() {
    let dataDefault = {
        donation: {}
    }
    try {
        if (!fs.existsSync(JSON_FILE)) {
            fs.writeFileSync(JSON_FILE, JSON.stringify(dataDefault));
            return dataDefault;
        }
        const data = fs.readFileSync(JSON_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error membaca file:', error);
        return dataDefault;
    }
}

app.post("/getdata", (req, res) => {
    const { token } = req.body;
    if (token === TOKEN) {
        var data = ReadJSONData();
        return res.send(data);
    }
    return res.send({
        success: false,
        message: "Token Invalid"
    });
})

app.listen(PORT, () => {
    console.log(`Server Berjalan Di Port ${PORT}`);
})