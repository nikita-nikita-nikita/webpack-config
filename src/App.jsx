import React from 'react';
import "./appStyles.scss";
import {hot} from 'react-hot-loader/root';
import Hello from "./components/hello";

const App = () => (
    <main className="app">
        <Hello/>
    </main>
);

export default hot(App);
