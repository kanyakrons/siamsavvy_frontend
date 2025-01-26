import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Button, TextField, Typography, Tabs, Tab, Box, CircularProgress, Backdrop } from '@mui/material';
import { LocationOn, Delete } from '@mui/icons-material';
import axios from 'axios';

function GeneratePlan() {
    const [currentDate, setCurrentDate] = useState('');
    const [selectedChoice, setSelectedChoice] = useState('AutoGeneratePlanning');
    const [category, setCategory] = useState([]);
    const [city, setCity] = useState('');
    const [numOfDays, setNumOfDays] = useState(0);
    const [maxDistance, setMaxDistance] = useState('');
    const [planDetails, setPlanDetails] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);
    const [loading, setLoading] = useState(false);  // New loading state

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

        // Set loading to true before the request
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8095/openai/generate-plan', planData);
            setPlanDetails(response.data);
        } catch (error) {
            console.error('Error generating plan:', error);
        } finally {
            // Set loading to false after response is received
            setLoading(false);
        }
    };

    const handleDayTabChange = (event, newValue) => {
        setSelectedDay(newValue);
    };

    return (
        <div style={{ padding: '50px 100px', backgroundColor: '#fafafa' }}>
            <div id="planHeader" style={{ marginBottom: '10px' }}>
                <TextField
                    fullWidth
                    label="Plan Name"
                    variant="outlined"
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: '24px',
                        }
                    }}
                />
                <p style={{ fontSize: '12px', color: '#888' }}>{currentDate}</p>
            </div>

            <div style={{ display: 'flex' }}>
                <div id="planCustomized" style={{ width: '50%' }}>
                    <h1>Auto-Generate Plan</h1>
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
                                        <MenuItem value="ตลาดและแหล่งช้อปปิ้ง">ตลาดและแหล่งช้อปปิ้ง</MenuItem>
                                        <MenuItem value="พิพิธภัณฑ์">พิพิธภัณฑ์</MenuItem>
                                        <MenuItem value="วัดและศาสนสถาน">วัดและศาสนสถาน</MenuItem>
                                        <MenuItem value="ภูเขาและจุดชมวิว">ภูเขาและจุดชมวิว</MenuItem>
                                        <MenuItem value="หาดและทะเล">หาดและทะเล</MenuItem>
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
                                        <MenuItem value="กรุงเทพมหานคร">กรุงเทพมหานคร</MenuItem>
                                        <MenuItem value="เชียงใหม่">เชียงใหม่</MenuItem>
                                        <MenuItem value="ภูเก็ต">ภูเก็ต</MenuItem>
                                        <MenuItem value="นครราชสีมา">นครราชสีมา</MenuItem>
                                        <MenuItem value="อุบลราชธานี">อุบลราชธานี</MenuItem>
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

                            <Button variant="contained" onClick={handleGenerate} style={{ padding: '10px 20px', marginTop: '30px' }}>
                                Generate
                            </Button>
                        </div>
                    )}
                </div>

                {planDetails && (
                    <div id="planDetail" style={{ marginLeft: '5%', width: '45%', marginTop: '10px' }}>
                        {/* Day Tabs */}
                        <Tabs
                            value={selectedDay}
                            onChange={handleDayTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {planDetails.trip.itinerary.map((dayPlan, dayIndex) => (
                                <Tab
                                    label={`Day ${dayPlan.day}`}
                                    key={dayIndex}
                                    sx={{ fontSize: '22px'}}    
                                />
                            ))}
                        </Tabs>

                        {/* Places Detail for the Selected Day */}
                        {planDetails.trip.itinerary[selectedDay].places.map((place, placeIndex) => (
                            <div key={placeIndex} style={{ position: 'relative', marginBottom: '20px' }}>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    padding="15px"
                                    border="1px solid #ddd"
                                    borderRadius="8px"
                                    marginBottom="10px"
                                    position="relative"
                                    backgroundColor="white"
                                    boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationOn style={{ marginRight: '10px', color: '#888' }} />
                                        <Typography variant="body1" style={{fontSize: '18px'}}>{place.place_name}</Typography>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body2" style={{ marginRight: '20px' }}>
                                            {place.start_time} - {place.end_time}
                                        </Typography>
                                        <Button size="small">
                                            <Delete style={{ color: '#ff0000' }} />
                                        </Button>
                                    </div>
                                </Box>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Full-screen Loading Spinner */}
            {loading && (
                <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </div>
    );
}

export default GeneratePlan;
