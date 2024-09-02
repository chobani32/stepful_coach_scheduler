import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import '../Style.css';

function Student() {
    let { id } = useParams();
    const [phoneNumber, setPhoneNumber] = useState("")
    const [apts, setApts] = useState([])
    const [pastApts, setPastApts] = useState([])
    const [coachesList, setCoachesList] = useState([])
    const [selectedCoach, setSelectedCoach] = useState("")
    const [coachingSlots, setCoachingSlots] = useState([])

    useEffect(() => {
        fetch("/student/" + id, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPhoneNumber(data.phone_number)
                setApts(data.appointments)
                setPastApts(data.past_appointments)
                setCoachesList(data.coaches_list)
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        fetch("/coach/open_slots/"+selectedCoach, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCoachingSlots(data.open_slots)
            })
            .catch((error) => console.log(error));
    }, [selectedCoach]);

    return (
        <div>
            <h1 className="center">Coach Portal</h1>
            <div className="column">
                <h2>Student Info</h2>
                <br></br>
                <b>Username:</b> {id}
                <br></br>
                <b>Phone Number:</b> {phoneNumber}
                <br></br>
                <br></br>

                <h2>Upcoming Sessions</h2>
                <ul>
                    {apts.map(a => (
                        <div className="list">
                            <b>Coach: </b>{a[1]}
                            <br></br>
                            <b>Phone number: </b>{a[2]}
                            <br></br>
                            <b>Starting Time: </b>{format(new Date(a[0]), 'MMM dd, yyyy h a')}
                        </div>
                    ))}
                </ul>

                {/* <h2>Past Sessions</h2>
                <ul>
                    {pastApts.map(p => (
                        <div className="list">
                            <b>Coach: </b>{p[1]}
                            <br></br>
                            <b>Starting Time: </b>{format(new Date(p[0]), 'MMM dd, yyyy h a')}
                        </div>
                    ))}
                </ul> */}

            </div>

            <div className="column">
                <h2>Book Coaching Session</h2>
                <h4>Select Coach</h4>
                <select value={selectedCoach} onChange={(c) => setSelectedCoach(c.target.value)}>
                    <option value="" selected disabled hidden>Choose Coach</option>
                    {coachesList.map(c => (
                        <option value={c}>{c}</option>
                    ))}
                </select>
                {(() => {
                    if (selectedCoach !== "") {
                        return <>
                            <h4>Available Slots</h4>
                            <ul>
                                {coachingSlots.map(s => (
                                    <div className="list">
                                        {format(new Date(s), 'MMM dd, yyyy h a')}
                                        <button>Schedule</button>
                                    </div>
                                ))}
                            </ul>
                        </>
                    }
                })()}
            </div>

        </div>
    );
}

export default Student;
