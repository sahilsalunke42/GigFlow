import app from "./app.ts";
import connectDB from "./cofig/db.ts";


connectDB();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});