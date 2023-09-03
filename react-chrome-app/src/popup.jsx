/* eslint-disable no-undef */
import React, { useEffect } from "react";
import { render } from "react-dom";
import './popup.css';

function Popup() {
    useEffect(() => {
        console.log('hello');
        let x = chrome.storage.sync.get();
        console.log(x);
        // chrome.storage.sync.clear();
    })

    return (
        <>
            <div id='top-container'>
                <div id='top-jobs-applied-today'>
                    5 applied today
                </div>
                <div id='top-total-jobs-applied'>
                    25 applied total
                </div>
            </div>
            <div id='middle-container'>
                <div id='middle-left-metric'>
                    metric 1
                </div>
                <div id='middle-right-metric'>
                    metric 2
                </div>
            </div>
            <div id='bottom-container'>
                <div id='bottom-title'>
                    Most Recently Applied
                </div>
                <div id='most-recent-jobs-list'>
                    <ul>
                        <li>job1</li>
                        <li>job2</li>
                        <li>job3</li>
                        <li>job4</li>
                        <li>job5</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

render(<Popup />, document.getElementById('react-target'));