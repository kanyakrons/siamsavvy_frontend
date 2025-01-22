import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Button, TextField, Typography, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';

function GeneratePlan() {
    const [currentDate, setCurrentDate] = useState('');
    const [selectedChoice, setSelectedChoice] = useState('AutoGeneratePlanning');
    const [category, setCategory] = useState([]);
    const [city, setCity] = useState('');
    const [numOfDays, setNumOfDays] = useState(0);
    const [maxDistance, setMaxDistance] = useState('');
    const [planDetails, setPlanDetails] = useState(null);

    useEffect(() => {
        const today = new Date();
        const options = { weekday: 'short', year: 'numeric', month: 'long', day: '2-digit' };
        const formattedDate = today.toLocaleDateString('en-GB', options);
        setCurrentDate(formattedDate);
    }, []);

    const handleChoiceChange = (choice) => {
        setSelectedChoice(choice);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleGenerate = async () => {
        const planData = {
            numberOfDay: numOfDays,
            categories: category.join(','),
            city: city,
            maxDistance: parseFloat(maxDistance),
        };

        try {
            const response = await axios.post('http://localhost:8095/openai/generate-plan', planData);
            setPlanDetails(response.data);
        } catch (error) {
            console.error('Error generating plan:', error);
        }
    };

    return (
        <div style={{ padding: '50px 100px' }}>
            <div id="planHeader" style={{ marginBottom: '30px' }}>
                <input
                    placeholder="Name your plan"
                    style={{ fontSize: '24px', fontWeight: '600', padding: '10px', width: '30%' }}
                />
                <p style={{ fontSize: '12px', color: '#888' }}>{currentDate}</p>
            </div>

<div style={{ display: 'flex'}}>
            <div id="planCustomized" style={{ width: '50%' }}>
                {selectedChoice === 'AutoGeneratePlanning' && (
                    <div id="planCriteria">
                        <div style={{ marginBottom: '10px' }}>
                            <TextField
                                type="number"
                                fullWidth
                                label="Number of Days"
                                variant="outlined"
                                value={numOfDays}
                                onChange={(e) => setNumOfDays(e.target.value)}
                            />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <FormControl fullWidth>
                                <InputLabel>Categories</InputLabel>
                                <Select
                                    multiple
                                    value={category}
                                    onChange={handleCategoryChange}
                                    label="Categories"
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    <MenuItem value="Shopping/Street Market">Shopping/Street Market</MenuItem>
                                    <MenuItem value="Farm">Farm</MenuItem>
                                    <MenuItem value="Museum">Museum</MenuItem>
                                    <MenuItem value="Religious Sites">Religious Sites</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <FormControl fullWidth>
                                <InputLabel>Select City</InputLabel>
                                <Select
                                    value={city}
                                    onChange={handleCityChange}
                                    label="Select City"
                                >
                                    <MenuItem value="Bangkok">Bangkok</MenuItem>
                                    <MenuItem value="Chiang Mai">Chiang Mai</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <TextField
                                type="number"
                                step="0.1"
                                fullWidth
                                label="Maximum Distance (km)"
                                variant="outlined"
                                value={maxDistance}
                                onChange={(e) => setMaxDistance(e.target.value)}
                            />
                        </div>

                        <Button variant="contained" onClick={handleGenerate} style={{ padding: '10px 20px' }}>
                            Generate
                        </Button>
                    </div>
                )}
            </div>

            {planDetails && (
                    <div id="planDetail" style={{ marginLeft: '5%', width: '45%' }}>
                        {planDetails.trip.itinerary.map((dayPlan, dayIndex) => (
                            <div key={dayIndex}>
                                <Typography variant="h6" gutterBottom>
                                    Day {dayPlan.day}
                                </Typography>

                                <Grid container spacing={2}>
                                    {dayPlan.places.map((place, placeIndex) => (
                                        <Grid item xs={12} md={4} key={placeIndex}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h6">{place.place_name}</Typography>
                                                    <Typography variant="body2">
                                                        Time: {place.start_time} - {place.end_time}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Location: {place.location}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                        ))}
                    </div>
                )}
                </div>
        </div>
    );
}

export default GeneratePlan;
