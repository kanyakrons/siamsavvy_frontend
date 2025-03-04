import { useEffect, useState } from "react";
import { getPlaces, getProvinces } from "../api/placeApi";
import { getCategories } from "../api/categoryApi";
import Select from "react-select";
import { setError } from "../redux/dataService";

const Place = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search & filter states
    const [provinces, setProvinces] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const placesData = await getPlaces();
                const provincesData = await getProvinces();
                const categoriesData = await getCategories();

                setPlaces(placesData);
                setFilteredPlaces(placesData);
                setProvinces(provincesData);
                setCategories(categoriesData);
            }
            catch (error) {
                setError("Error fetching data");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle filtering when inputs change
    useEffect(() => {
        let filtered = places;

        if (searchQuery) {
            filtered = filtered.filter(
                (place) =>
                    place.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    place.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedProvinces.length > 0) {
            const provinceNames = selectedProvinces.map((p) => p.value);
            filtered = filtered.filter((place) => provinceNames.includes(place.province));
        }

        if (selectedCategories.length > 0) {
            const categoryNames = selectedCategories.map((c) => c.value);
            filtered = filtered.filter((place) => categoryNames.includes(place.category.id));
        }

        setFilteredPlaces(filtered);
    }, [searchQuery, selectedProvinces, selectedCategories, places]);

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Places List</h2>

            {/* Search Bar */}
            <div style={{
                display: "flex",
                gap: "15px",
                marginBottom: "20px",
                justifyContent: "center",
                alignItems: "center",
            }}>
                {/* Province Multi-Select */}
                <Select
                    isMulti
                    options={provinces.map((p) => ({ value: p, label: p }))}
                    value={selectedProvinces}
                    onChange={setSelectedProvinces}
                    placeholder="Filter by Province"
                    styles={{ width: "250px" }}
                />

                {/* Search by Place Name */}
                <input
                    type="text"
                    placeholder="Search by Place Name (Thai/English)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: "10px",
                        width: "300px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                    }}
                />

                {/* Category Multi-Select */}
                <Select
                    isMulti
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                    value={selectedCategories}
                    onChange={setSelectedCategories}
                    placeholder="Filter by Category"
                    styles={{ width: "250px" }}
                />
            </div>

            {/* Grid Display */}
            {loading ? (
                <p>Loading places...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                }}>
                    {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place) => (
                            <div key={place.id} style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                borderRadius: "8px",
                                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                                background: "#fff",
                            }}>
                                <h3 style={{ marginBottom: "5px" }}>{place.nameTh} ({place.nameEn})</h3>
                                <p><strong>Province:</strong> {place.province}</p>
                                <p><strong>Category:</strong> {place.category.name}</p>
                            </div>
                        ))
                    ) : (
                        <p>No places found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Place;
