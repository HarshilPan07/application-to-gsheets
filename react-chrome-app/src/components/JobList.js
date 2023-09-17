const Job = ({ job }) => {
    return (
        <li class='job-list-item'>
            <div class='job-item-left-container'>
                <span class='job-item-title'>{job[2]}</span>
                <small class='job-item-company'>{ job[1] }</small>
            </div>
            <div class='job-item-right-container'>
                <span>{ job[3] }</span>
            </div>
        </li>
    )
}

const JobList = ({ todaysApps }) => {
    if(todaysApps.length == 0) {
        return (
            <div>
                <span>No Jobs Applied To Today</span>
            </div>
        )
    } else {
        return (
            <ul id='recently-applied-list' class='scroll-bar-hide'>
                { todaysApps.map(job => <Job key={job[0]} job={job}/> )}
            </ul>
        )
    }
}

export default JobList