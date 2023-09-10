/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import './popup.css';

function Popup() {
    useEffect(() => {
        console.log('hello');
        let x = chrome.storage.sync.get();
        console.log(x);
        // chrome.storage.sync.clear();
        // getAppsDoneToday();
    })

    const getAppsDoneToday = () => {
        chrome.tabs.query({ active: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "SHEET",
            }).then((response) => {
                console.log(response);
                setNumAppliedToday(5);
            });
        });
    }

    const [numAppliedToday, setNumAppliedToday] = useState(0);
    const [todaysApps, setTodaysApps] = useState([]);

    return (
        <>
            <section id='applied-today-section'>
                <div id='applied-today-top'>
                    <span id='applied-number'><h1>{numAppliedToday}</h1></span>
                    <span id='applied-bottom-text'>Completed Today</span>
                </div>
                <div id='total-applied'>
                    <span><a href="#"><small>Total: 249 applications</small></a></span>
                </div>
            </section>
            <section id='metrics-section'>
                <div class='metric-item' id='metric-1'></div>
                <div class='metric-item' id='metric-2'></div>
                <div class='metric-item' id='metric-3'></div>
                <div class='metric-item' id='metric-4'></div>
                <div class='metric-item' id='metric-5'></div>
            </section>
            <section id='job-list-section'>
                <div id='recently-applied-header'>
                    <text>Recent Applications</text>
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
                </ul>
            </section>
        </>
    );
}

render(<Popup />, document.getElementById('react-target'));

/* <>
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
        <span id='applied-number'><h1>16</h1></span>
        <span id='applied-bottom-text'><small>Apps Done Today</small></span>
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
</> */