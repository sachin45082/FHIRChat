import { useState, useEffect } from "react";
import "./App.css";
import { VectorStorage } from "vector-storage";

function App() {
  const openAIApiKey = 'Key';

  const [text, setText] = useState("");

  const [chat, setChat] = useState([]);

  const [patientInfo, setPatientInfo] = useState({}); // State to store patient info
  const [procedureInfo, setProcedureInfo] = useState({}); // State to store procedure info
  const [observationInfo, setObservationInfo] = useState({}); // State to store observation info
  const [medicationInfo, setMedicationInfo] = useState({}); // State to store observation info
  
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const [selectedPatientId, setSelectedPatientId] = useState("39e87eff-8569-472e-b528-964b45a37c8b"); // Initial patient ID

  // Replace with the actual HAPI public server URL and resource path
  const patientApiBaseUrl = "https://hapi.fhir.org/baseR4/Patient/";
  const procedureApiBaseUrl = "https://hapi.fhir.org/baseR4/Procedure?patient=";
  const observationApiBaseUrl = "https://hapi.fhir.org/baseR4/Observation?patient=";
  const medicationApiBaseUrl = "https://hapi.fhir.org/baseR4/MedicationRequest?patient=";

  useEffect(() => {
    const fetchPatientInfo = async () => {

      const patientApiUrl = `${patientApiBaseUrl}${selectedPatientId}`;
      try {
        const response = await fetch(patientApiUrl);
        if (!response.ok) {
          throw new Error(`Error fetching patient info: ${response.statusText}`);
        }
        const data = await response.json();
        setPatientInfo(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
      const procedureApiUrl = `${procedureApiBaseUrl}${selectedPatientId}`;
      try {
        const response = await fetch(procedureApiUrl);
        if (!response.ok) {
          throw new Error(`Error fetching procedure procedure info: ${response.statusText}`);
        }
        const data = await response.json();
        setProcedureInfo(data);
      } catch (error) { 
        setErrorMessage(error.message);
      }

      const observationApiUrl = `${observationApiBaseUrl}${selectedPatientId}`;
      try {
        const response = await fetch(observationApiUrl);
        if (!response.ok) {
          throw new Error(`Error fetching observation info: ${response.statusText}`);
        }
        const data = await response.json();
        setObservationInfo(data);
      } catch (error) {
        setErrorMessage(error.message);
      }

      const medicationApiUrl = `${medicationApiBaseUrl}${selectedPatientId}`;
      try {
        const response = await fetch(medicationApiUrl);
        if (!response.ok) {
          throw new Error(`Error fetching medication info: ${response.statusText}`);
        }
        const data = await response.json();
        setMedicationInfo(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchPatientInfo(); // Fetch patient info initially
  }, [selectedPatientId]); // Re-fetch when patient ID changes
 
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text) return;
    setChat([...chat, { text, user: "You" }]);
    const currentMessages = []
    setText("");
    const bio = patientInfo;
    patientInfo.text = text;
    patientInfo.procedure = procedureInfo;
    patientInfo.observation = observationInfo;
    patientInfo.medication = medicationInfo;

      try{
      // Create an instance of VectorStorage
      const vectorStore =  null;
      vectorStore = new VectorStorage({ openAIApiKey: openAIApiKey });
      await vectorStore.addText(JSON.stringify(bio), {
        category: "bio",
      });
      await vectorStore.addText(JSON.stringify(patientInfo.medication), {
        category: "medication",
      });
      await vectorStore.addText(JSON.stringify(patientInfo.procedure), {
        category: "procedure",
      });
      await vectorStore.addText(JSON.stringify(patientInfo.observation), {
        category: "observation",
      });      
      // Perform a similarity search
      const results = await vectorStore.similaritySearch({
        query: text,
      });

      // Display the search results
      console.log(results);      
    } catch (error) {
      setErrorMessage(error.message);
    }
    const response = await fetch("https://healthgptvercel-server.vercel.app/api/chatbot", {
    //const response = await fetch("http://localhost:3001/api/chatbot", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientInfo }) //+ "," +JSON.stringify({ text })
 
    });
    const data = await response.json();
    setChat(state => [...state, { text: data.reply, user: "Healthbot" }]);


    
  };
  return (
    <body bgcolor="e6f2f7">
    <div align="center">
    <div className="App">
    <h1 align="center">HealthGPT</h1>
      {/* Drop Down for Patient IDs */}
      <div align="left">
      <label><b>Select Patient ID:   </b></label>
      <select value={selectedPatientId} onChange={(e) => {setSelectedPatientId(e.target.value); setChat([]);} }>
        <option value="39e87eff-8569-472e-b528-964b45a37c8b">Patient 39e87eff-8569-472e-b528-964b45a37c8b</option>
        <option value="7493ddc7-5300-4971-a592-65a20752922d">Patient 7493ddc7-5300-4971-a592-65a20752922d</option>

        <option value="593162">Patient 593162</option>
        <option value="2000180">Patient 2000180</option>
        <option value="7304958">Patient 7304958</option>
        <option value="593180">Patient 593180</option>
        <option value="593185">Patient 593185</option>
        
        {/* Add more options for different patient IDs */}
      </select>
      <img align="right" src="person.png" alt="" width="100"></img>
      </div>
      
      {/* Display patient info if available, otherwise show error message */}
      {patientInfo.hasOwnProperty("id") ? (
        <div align="right">
          <h2>Patient Information</h2>
          <table>
            
          <b>Name</b>: {" "} 
            {patientInfo.name[0].text ? patientInfo.name[0].text : patientInfo.name[0].family + " "+ patientInfo.name[0].given[0] }
            <br></br>
          <b>Date of Birth:</b>{" "}
            {patientInfo.birthDate
              ? new Date(patientInfo.birthDate).toLocaleDateString()
              : "Not available"}
            <br></br>
            <b>Gender: </b>{" "}
            {patientInfo.gender
              ? patientInfo.gender
              : "Not available"}
            <br></br>
            <b>Address:</b>{" "}
            {patientInfo.address && patientInfo.address[0].line[0]
              ? patientInfo.address[0].line[0]
              : "Not available"}
            <br></br>
            <b>Mobile Number:</b>{" "}
            {patientInfo.telecom &&
            patientInfo.telecom.find((tel) => tel.use === "mobile")
              ? patientInfo.telecom.find((tel) => tel.use === "mobile").value
              : "Not available"}
            <br></br>
            <b>Home Phone:</b>{" "}
            {patientInfo.telecom &&
            patientInfo.telecom.find((tel) => tel.use === "home")
              ? patientInfo.telecom.find((tel) => tel.use === "home").value
              : "Not available"}
          
          {/* Disclaimer about privacy */}
 
          </table>
        </div>
      
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <p>Loading patient information...</p>
      )}
      
      {/* Rest of your chatbot code remains the same */}
      <div><img src="iphone-icon-19017.png" alt="" width="50" height="40"></img></div>
      <div>What can I help you with today?</div>  
      <div className="Appchat">
        <div className="chat-container">
          {chat.map((message, i) => (
            <p key={i}>
              <strong>{message.user}: </strong>
              {message.text}
            </p>
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            size="50"
            height="100px"
            placeholder="Message HealthGPT with your questions"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit"><img src="up1.png" alt="" width="15"></img></button>

        </form>
        </div>
    </div>
    </div>
    </body>
  );
   
}

export default App
