import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
export const theme = createTheme({
    palette: {
        background: {
            default: '#1f393c'
        },
        primary: {
            main: '#597f80',
            contrastText: 'white'
        },
        secondary: {
            main: '#486869'
        },
        table: {
            main: '#212729',
            secondary: '#2a3235'
        }

    }
})
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
