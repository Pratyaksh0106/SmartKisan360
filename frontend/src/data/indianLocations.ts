// ─── Indian States & Cities Database ─────────────────────────────────────────
// Key cities and towns for each state/UT, focused on agricultural regions

export interface StateData {
    state: string;
    cities: string[];
}

export const INDIAN_STATES: StateData[] = [
    {
        state: 'Andhra Pradesh',
        cities: ['Amaravati', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kakinada', 'Rajahmundry', 'Eluru', 'Ongole', 'Anantapur', 'Chittoor', 'Kadapa', 'Srikakulam', 'Machilipatnam', 'Tenali', 'Narasaraopet', 'Hindupur'],
    },
    {
        state: 'Arunachal Pradesh',
        cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Along', 'Tezu'],
    },
    {
        state: 'Assam',
        cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Goalpara', 'Karimganj', 'Sivasagar', 'Lakhimpur'],
    },
    {
        state: 'Bihar',
        cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Sasaram', 'Samastipur', 'Hajipur', 'Bettiah', 'Motihari', 'Sitamarhi', 'Siwan', 'Nawada'],
    },
    {
        state: 'Chhattisgarh',
        cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur', 'Dhamtari', 'Mahasamund', 'Kanker'],
    },
    {
        state: 'Goa',
        cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim'],
    },
    {
        state: 'Gujarat',
        cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari', 'Mehsana', 'Morbi', 'Bharuch', 'Surendranagar', 'Palanpur', 'Amreli', 'Porbandar', 'Kutch', 'Dahod'],
    },
    {
        state: 'Haryana',
        cities: ['Chandigarh', 'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Hisar', 'Karnal', 'Sonipat', 'Rohtak', 'Sirsa', 'Bhiwani', 'Jind', 'Kaithal', 'Kurukshetra', 'Fatehabad', 'Rewari', 'Palwal', 'Yamunanagar'],
    },
    {
        state: 'Himachal Pradesh',
        cities: ['Shimla', 'Manali', 'Dharamsala', 'Mandi', 'Solan', 'Kullu', 'Bilaspur', 'Hamirpur', 'Una', 'Nahan', 'Palampur', 'Kangra'],
    },
    {
        state: 'Jharkhand',
        cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Dumka', 'Chaibasa', 'Lohardaga'],
    },
    {
        state: 'Karnataka',
        cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belgaum', 'Davanagere', 'Bellary', 'Gulbarga', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hassan', 'Mandya', 'Udupi', 'Chikkamagaluru', 'Dharwad', 'Gadag', 'Bagalkot'],
    },
    {
        state: 'Kerala',
        cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam', 'Malappuram', 'Idukki', 'Wayanad', 'Pathanamthitta', 'Kasaragod'],
    },
    {
        state: 'Madhya Pradesh',
        cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Chhindwara', 'Hoshangabad', 'Vidisha', 'Damoh', 'Shahdol', 'Mandsaur', 'Neemuch', 'Tikamgarh', 'Shivpuri'],
    },
    {
        state: 'Maharashtra',
        cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Nanded', 'Akola', 'Latur', 'Jalgaon', 'Ahmednagar', 'Chandrapur', 'Sangli', 'Satara', 'Wardha', 'Yavatmal', 'Osmanabad', 'Buldhana', 'Beed'],
    },
    {
        state: 'Manipur',
        cities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul'],
    },
    {
        state: 'Meghalaya',
        cities: ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar'],
    },
    {
        state: 'Mizoram',
        cities: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'],
    },
    {
        state: 'Nagaland',
        cities: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Mon'],
    },
    {
        state: 'Odisha',
        cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Balasore', 'Puri', 'Baripada', 'Bhadrak', 'Jharsuguda', 'Koraput', 'Kendrapara', 'Jajpur', 'Angul'],
    },
    {
        state: 'Punjab',
        cities: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Moga', 'Pathankot', 'Ferozepur', 'Sangrur', 'Mansa', 'Muktsar', 'Barnala', 'Kapurthala', 'Fazilka', 'Faridkot', 'Gurdaspur'],
    },
    {
        state: 'Rajasthan',
        cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar', 'Bhilwara', 'Sikar', 'Sri Ganganagar', 'Pali', 'Tonk', 'Nagaur', 'Barmer', 'Churu', 'Jhunjhunu', 'Hanumangarh', 'Chittorgarh', 'Bundi', 'Banswara', 'Dungarpur', 'Pratapgarh'],
    },
    {
        state: 'Sikkim',
        cities: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Ravangla'],
    },
    {
        state: 'Tamil Nadu',
        cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Thanjavur', 'Dindigul', 'Cuddalore', 'Kanchipuram', 'Nagercoil', 'Karur', 'Tiruvannamalai', 'Sivaganga', 'Villupuram', 'Nagapattinam'],
    },
    {
        state: 'Telangana',
        cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Medak', 'Siddipet', 'Mancherial', 'Jagtial'],
    },
    {
        state: 'Tripura',
        cities: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Ambassa'],
    },
    {
        state: 'Uttar Pradesh',
        cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut', 'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur', 'Saharanpur', 'Jhansi', 'Mathura', 'Noida', 'Ghaziabad', 'Firozabad', 'Sultanpur', 'Faizabad', 'Rae Bareli', 'Hardoi', 'Sitapur', 'Unnao', 'Lakhimpur Kheri', 'Bahraich', 'Basti', 'Deoria', 'Azamgarh', 'Jaunpur', 'Mirzapur', 'Fatehpur', 'Banda', 'Hamirpur', 'Shahjahanpur'],
    },
    {
        state: 'Uttarakhand',
        cities: ['Dehradun', 'Haridwar', 'Haldwani', 'Roorkee', 'Rishikesh', 'Kashipur', 'Rudrapur', 'Udham Singh Nagar', 'Nainital', 'Almora', 'Pithoragarh', 'Chamoli'],
    },
    {
        state: 'West Bengal',
        cities: ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol', 'Bardhaman', 'Malda', 'Kharagpur', 'Haldia', 'Bankura', 'Cooch Behar', 'Jalpaiguri', 'Purulia', 'Murshidabad', 'Nadia', 'Birbhum', 'Hooghly', 'Midnapore'],
    },
    // Union Territories
    {
        state: 'Delhi',
        cities: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
    },
    {
        state: 'Jammu & Kashmir',
        cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Pulwama', 'Sopore', 'Rajouri', 'Poonch'],
    },
    {
        state: 'Ladakh',
        cities: ['Leh', 'Kargil'],
    },
    {
        state: 'Puducherry',
        cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
    },
    {
        state: 'Chandigarh',
        cities: ['Chandigarh'],
    },
    {
        state: 'Andaman & Nicobar',
        cities: ['Port Blair', 'Car Nicobar', 'Diglipur'],
    },
    {
        state: 'Dadra Nagar Haveli & Daman Diu',
        cities: ['Silvassa', 'Daman', 'Diu'],
    },
    {
        state: 'Lakshadweep',
        cities: ['Kavaratti', 'Agatti', 'Minicoy'],
    },
];

// Helper: get all state names
export const STATE_NAMES = INDIAN_STATES.map(s => s.state).sort();

// Helper: get cities for a given state
export function getCitiesForState(stateName: string): string[] {
    const found = INDIAN_STATES.find(s => s.state === stateName);
    return found ? found.cities.sort() : [];
}
