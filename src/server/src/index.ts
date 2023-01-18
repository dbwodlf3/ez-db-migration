import express from "express";
import settings from "./settings"

const app = express();

app.listen(settings.port, '0.0.0.0', async ()=>{
    
    app.get("/admin/dashboard", (req, res)=>{
        return res.end("Hello dongsik koon;");
    });

    console.log(`Server is running on ${settings.port} port`);
});
