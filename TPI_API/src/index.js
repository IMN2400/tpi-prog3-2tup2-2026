import express from 'express';
import morgan from 'morgan';
import {PORT} from './config/config.js';
import banRoutes from './routes/banRoutes.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/bans', banRoutes);
app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.listen(config.PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});