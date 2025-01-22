import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MainPage = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch student data from the API
        axios.get('http://localhost:8095/student/all')
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the student data!", error);
                setError("Failed to fetch data");
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to SiamSavvy</h1>
            <h2>Student List</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {students.length > 0 ? (
                <ul>
                    {students.map(student => (
                        <li key={student.id}>
                            {student.name} - {student.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading student data...</p>
            )}
        </div>
    );
};

export default MainPage;
