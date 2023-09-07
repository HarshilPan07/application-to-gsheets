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
            <div id="left-metrics">
                <div id='left-metric-1'>

                </div>
                <div id='left-metric-2'>

                </div>
                <div id='left-metric-3'>

                </div>
            </div>
            <div id='center-panel'>
                <div id='center-applied-today'>

                </div>
                <div id='center-total-applied'>

                </div>
            </div>
            <div id='right-metrics'>
                <div id='right-metric-1'>

                </div>
                <div id='right-metric-2'>

                </div>
                <div id='right-metric-3'>

                </div>
            </div>
            <div id='bottom-joblist-container'>
                <div id='recently-applied-header'>
                    <text>Recently Applied</text>
                </div>
                <ul id='recently-applied-list' class='scroll-bar-hide'>
                    <li class='job-list-item'>Job 1</li>
                    <li class='job-list-item'>Job 2</li>
                    <li class='job-list-item'>Job 3</li>
                    <li class='job-list-item'>Job 4</li>
                    <li class='job-list-item'>Job 5</li>
                    <li class='job-list-item'>Job 6</li>
                </ul>
            </div>
        </>
    );
}

render(<Popup />, document.getElementById('react-target'));

/*
<div id='recently-applied-container'>
                <div id='recently-applied-header'>
                    <text>Recently Applied</text>
                </div>
                <ul id='recently-applied-list' class='scroll-bar-hide'>
                    <li class='job-list-item'>Job 1</li>
                    <li class='job-list-item'>Job 2</li>
                    <li class='job-list-item'>Job 3</li>
                    <li class='job-list-item'>Job 4</li>
                    <li class='job-list-item'>Job 5</li>
                    <li class='job-list-item'>Job 6</li>
                </ul>
            </div>

*/