import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App/App';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
//   <React.StrictMode>
     <BrowserRouter>
        <App />
     </BrowserRouter>,
//   </React.StrictMode>,
  document.getElementById('root')
);

