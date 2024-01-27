import './style.css';
import DisplayController from './presentation/displayController';
import AppController from './domain/appController';
import LocalStorage from './data/localStorage';

const db = new LocalStorage();
const app = new AppController(db); 

const display = new DisplayController(app);

display.init();

