/* eslint-disable no-undef */
import React from "react";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import './popup.css';

import JobList from './components/JobList';

const Popup = () => {
    useEffect(() => {
        console.log('hello');
        let x = chrome.storage.sync.get();
        console.log(x);
        // chrome.storage.sync.clear();
        getAppsDoneToday();
    }, [numAppliedToday])

    const getAppsDoneToday = () => {
        chrome.runtime.sendMessage({ type: "GET-TODAYS-JOBS" })
            .then((todaysJobs) => {
                const jobs = todaysJobs['todaysJobs'];
                console.log("inside popup", jobs);
                setTodaysApps(jobs);
                setNumAppliedToday(jobs.length);
            })
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
                <div class='metric-item' id='metric-1'>
                    <span>17% down</span>
                </div>
                <div class='metric-item' id='metric-2'>
                    <span>Applications</span>
                    <span>Over Time</span>
                </div>
                <div class='metric-item' id='metric-3'>
                    <span>Locations</span>
                </div>
                <div class='metric-item' id='metric-4'>
                    <span>Response</span>
                    <span>by</span>
                    <span>Location</span>
                </div>
                <div class='metric-item' id='metric-5'>
                    <small></small>
                </div>
            </section>
            <section id='job-list-section'>
                <div id='recently-applied-header'>
                    <text>Recent Applications</text>
                </div>
                <JobList todaysApps={todaysApps} />
            </section>
        </>
    );
}

render(<Popup />, document.getElementById('react-target'));

/*
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
*/
