import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import '../Style.css';

function Coach() {
    let { id } = useParams();
    const [phoneNumber, setPhoneNumber] = useState("")
    const [apts, setApts] = useState([])
    const [pastApts, setPastApts] = useState([])
    const [openSlots, setOpenSlots] = useState([])
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(0);
    const [timeAdd, setTimeAdd] = useState(0);
    const [slotAdded, setSlotAdded] = useState(true);
    const [reason, setReason] = useState(true);

    const handleAddSlot = () => {
        // ADDS "coach" to beginning of url?
        fetch("open_slots/" + id, {
          method: "POST",
          body: JSON.stringify({
            "coach_id": id,
            "date": date,
            "time": (+time + +timeAdd)
          })
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setOpenSlots(data.open_slots);
            setSlotAdded(data.slot_added)
            setReason(data.reason)
          })
          .catch((error) => console.log(error));
      }

      useEffect(() => {
        console.log("selected date: " + date)
        console.log("selected time: " + (+time + +timeAdd))
      }, [date, time, timeAdd]);

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
                <h2>Add new slot</h2>
                <DatePicker selected={date} onChange={(date) => setDate(date)} />
                <select value={time} onChange={(c) => setTime(c.target.value)}>
                    <option value="" selected disabled hidden>Time</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                        <option value={h}>{h}</option>
                    ))}
                </select>
                <select value={timeAdd} onChange={(c) => setTimeAdd(c.target.value)}>
                    <option value={0}>AM</option>
                    <option value={12}>PM</option>
                </select>
                <button onClick={handleAddSlot}>Add Slot</button>
                {(() => {
                    if (slotAdded === false) {
                        return <div color="red">Unable to add slot because {reason}</div>
                    }
                })()}
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
                                    return <>
                                    <select>
                                    <option value="" selected disabled hidden>Rating</option>
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <option value={r}>{r}</option>
                                    ))}
                                    </select>
                                    </>
                                } else {
                                    return <>{p[2]}</>
                                }
                            })()}
                            <br></br>
                            <b>Review: </b>
                            {/* TODO SUBMIT */}
                            {(() => {
                                if (p[3] == null) {
                                    return <>
                                    <input type="text">
                                    </input>
                                    </>
                                } else {
                                    return <>{p[3]}</>
                                }
                            })()}
                            <br></br>
                            {(() => {
                                if (p[2] == null || p[3] == null) {
                                    return <>
                                    <button>Submit</button>
                                    </>
                                }
                            })()}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Coach;
