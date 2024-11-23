import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import signUpRouter from './Routes/signUpRoute.js'
import signInRouter from './Routes/signInRoute.js'
import homePageRouter from './Routes/homePageRoute.js'
import subscriptionRouter from './Routes/subscriptionRoute.js'
import dashboardRouter from './Routes/dashBoardRoute.js'
dotenv.config()

const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());
app.use(express.static('Public'));

app.use('/signin', signInRouter);
app.use('/signup', signUpRouter);
app.use('/homepage', homePageRouter);
app.use('subscription', subscriptionRouter);
app.use('/dashboard', dashboardRouter);

app.listen(process.env.PORT, () => {
    console.log('app is listening to port: ' + process.env.PORT);
})