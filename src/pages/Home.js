import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents, getTeachers } from "../api/studentApi";

const Home = () => {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const teachers = useSelector((state) => state.data.teachers);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch student data from the API
    const fetchStudents = async () => {
      const studentData = await getStudents();
      setStudents(studentData);
    };
    fetchStudents();
    // getTeachers(dispatch);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* <h1>Welcome to SiamSavvy</h1> */}
      <h2>Student List</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}


<h1>{students.length}</h1>
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

export default Home;
