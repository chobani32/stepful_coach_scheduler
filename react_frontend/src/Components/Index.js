import React, { useState, useEffect } from "react";
import '../Style.css';

function Index() {
    const [test, setTest] = useState([]);

    useEffect(() => {
        fetch("/test", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setTest(data.test);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="center">
            <h1>Test</h1>
            <div>{test}</div>
        </div>
    );
}

export default Index;
