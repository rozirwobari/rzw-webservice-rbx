const fs = require('fs');
const express = require("express");
const app = express();
const PORT = 8000;
app.use(express.json());
const JSON_FILE = 'data.json';
const TOKEN = "ypYW5fimv55hwEjLCc0dWahkc00eMZE88aDhjUgvzcwH4sJGXOThAvomEwQlVfAe";

function ReadJSONData() {
    let dataDefault = {
        donation: []
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

function SaveDataJSON(data) {
    var getDataJSON = ReadJSONData()
    getDataJSON.donation.push(data)
    try {
        fs.writeFileSync(JSON_FILE, getDataJSON);
        console.log('✅ File berhasil disimpan');
        return true, "✅ File berhasil disimpan";
    } catch (error) {
        console.error('❌ Gagal menyimpan:', error.message);
        return false, error.message;
    }
}

app.get("/", (req, res) => {
    return res.send({
        success: true,
        message: "Hallo, Selamat Datang"
    });
})

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

app.post("/setdonation", (req, res) => {
    const dataWebhook = req.body;
    var getId = dataWebhook?.id || dataWebhook?.transaction_id
    var pesan = dataWebhook?.message
    var nominal = dataWebhook?.amount_raw || dataWebhook?.amount
    var getName = dataWebhook?.name || dataWebhook?.donator_name
    let success, message = SaveDataJSON({
        id: getId,
        name: getName,
        nominal: nominal,
        message: pesan,
    })
    if (success) {
        return res.send({
            success: true,
            message: message
        });
    }
    return res.send({
        success: false,
        message: message
    });
})

app.listen(PORT, () => {
    ReadJSONData();
    console.log(`Server Berjalan Di Port ${PORT}`);
})