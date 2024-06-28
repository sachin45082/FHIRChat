# Research

## Healthcare Tech Products market gap analysis
We first did a lot of Healthcare industry research to identify the problems and gaps in the current market and how latest technology can help to solve those problems. We identified some gaps in the current EMR systems. These systems have become so complex over a period of time and have a lot of semi-structured (JSON, XML etc.) and unstructered data to process. The provider has to understand the whole system to start using it. He has to click multiple tabs and search for specific information. So, First ittakes some time to get acquainted with the system, it is sometimes hectic for the provider to traverse through the application to search for relevant information. It is also not a good experience for the doctor and even the patient during their convesation. 
 
So, There is definitely some space here to enhance the user experience and make the EMR system for interactive and easy to look for relevant information.

## Research on Technology
* GenAI to solve the problem - We analyzed few latest solutions and found GenAI can help solvng this problem where we can provide a Chatbot type experience to answer specific questions about the patient very efficiently.
* Prompt Engineering and RAG architecture - We need to do a lot of research on Prompt engineering and RAG (Retrieval Augmented Genaration) model to retrieve the patient information and augment the model with this information to generate patient information related text. 

## Implementation Analysis 
* FHIR resources - We analyzed options to retrieve the Patient information and choose to fetch the Patient, Medication, Procedure and Observation resources using HAPI FHIR Test server APIs
* LLM, Vector DB, Langchain and integration with React/Node.js app - We did a lot of research on Large Language model, Vector DB, Langchain to understand how RAG architecture can be implemented using these components. We selected to call OpenAI GPT model APIs for GenAI. We had a lot of issues with Vector DB due to version incompatabilities with React but finally found vector-store to work well with React/Node.js. We tied everything together using Langchain JS.
* Deployment (Vercel) - We need to do some research to publish our app and chose Vercel for public access.
