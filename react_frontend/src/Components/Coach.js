import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import '../Style.css';

function Index() {
    let { id } = useParams();
    const [phoneNumber, setPhoneNumber] = useState("")
    const [apts, setApts] = useState([])
    const [pastApts, setPastApts] = useState([])
    const [openSlots, setOpenSlots] = useState([])

    useEffect(() => {
        fetch("/coach/" + id, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPhoneNumber(data.phone_number)
                setApts(data.appointments)
                setPastApts(data.past_appointments)
                setOpenSlots(data.open_slots)
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div>
            <h1 className="center">Coach Portal</h1>
            <div className="column">
                <h2>Coach Info</h2>
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
                            <b>Student: </b>{a[1]}
                            <br></br>
                            <b>Phone number: </b>{a[2]}
                            <br></br>
                            <b>Starting Time: </b>{format(new Date(a[0]), 'MMM dd, yyyy h a')}
                        </div>
                    ))}
                </ul>

            </div>

            <div className="column">
                <h2>Open Slots</h2>
                <ul>
                    {openSlots.map(s => (
                        <div className="list">
                            {format(new Date(s), 'MMM dd, yyyy h a')}
                        </div>
                    ))}
                </ul>
            </div>


            <div className="column">
                <h2>Past Sessions</h2>
                <ul>
                    {pastApts.map(p => (
                        <div className="list">
                            <b>Student: </b>{p[1]}
                            <br></br>
                            <b>Starting Time: </b>{format(new Date(p[0]), 'MMM dd, yyyy h a')}
                            <br></br>
                            <b>Review:</b>
                            <br></br>
                            <b>Rating: </b>
                            {(() => {
                                if (p[2] == null) {
                                    return <>TODO</>
                                } else {
                                    return <>{p[2]}</>
                                }
                            })()}
                            <br></br>
                            <b>Review: </b>
                            {(() => {
                                if (p[3] == null) {
                                    return <>TODO</>
                                } else {
                                    return <>{p[3]}</>
                                }
                            })()}
                        </div>
                    ))}
                </ul>
            </div>


        </div>
    );
}

export default Index;
