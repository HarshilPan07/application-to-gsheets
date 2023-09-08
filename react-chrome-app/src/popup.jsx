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
            <section id="left-metrics">
                <div id='left-metric-1'>

                </div>
                <div id='left-metric-2'>

                </div>
                <div id='left-metric-3'>

                </div>
            </section>
            <section id='center-panel'>
                <div id='center-applied-today'>

                </div>
                <div id='center-total-applied'>

                </div>
            </section>
            <section id='right-metrics'>
                <div id='right-metric-1'>

                </div>
                <div id='right-metric-2'>

                </div>
                <div id='right-metric-3'>

                </div>
            </section>
            <section id='bottom-joblist-container'>
                <div id='recently-applied-header'>
                    <text>Recently Applied</text>
                </div>
                <ul id='recently-applied-list' class='scroll-bar-hide'>
                    <li class='job-list-item'>
                        <div class='job-item-left-container'>
                            <span class='job-item-title'>Software Engineer</span>
                            <small class='job-item-company'>Company Name</small>
                        </div>
                        <div class='job-item-right-container'>
                            <span>Location</span>
                        </div>
                    </li>
                    <li class='job-list-item'>
                        <div class='job-item-left-container'>
                            <span class='job-item-title'>Software Engineer</span>
                            <small class='job-item-company'>Company Name</small>
                        </div>
                        <div class='job-item-right-container'>
                            <span>Location</span>
                        </div>
                    </li>
                    <li class='job-list-item'>
                        <div class='job-item-left-container'>
                            <span class='job-item-title'>Software Engineer</span>
                            <small class='job-item-company'>Company Name</small>
                        </div>
                        <div class='job-item-right-container'>
                            <span>Location</span>
                        </div>
                    </li>
                    <li class='job-list-item'>
                        <div class='job-item-left-container'>
                            <span class='job-item-title'>Software Engineer</span>
                            <small class='job-item-company'>Company Name</small>
                        </div>
                        <div class='job-item-right-container'>
                            <span>Location</span>
                        </div>
                    </li>
                    <li class='job-list-item'>
                        <div class='job-item-left-container'>
                            <span class='job-item-title'>Software Engineer</span>
                            <small class='job-item-company'>Company Name</small>
                        </div>
                        <div class='job-item-right-container'>
                            <span>Location</span>
                        </div>
                    </li>
                    <li class='job-list-item'>
                        <div class='job-item-left-container'>
                            <span class='job-item-title'>Software Engineer</span>
                            <small class='job-item-company'>Company Name</small>
                        </div>
                        <div class='job-item-right-container'>
                            <span>Location</span>
                        </div>
                    </li>
                </ul>
            </section>
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