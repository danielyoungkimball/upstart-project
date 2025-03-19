import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [documents, setDocuments] = useState([]);
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3, setField3] = useState("");
  const [editingDoc, setEditingDoc] = useState(null);

  // Fetch all documents on load
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    axios.get("http://localhost:5001/api/documents")
      .then(response => setDocuments(response.data))
      .catch(error => console.error(error));
  };

  // Create or update a document
  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log("Submitting Document:", { field1, field2, field3 }); // Debugging
  
    if (editingDoc) {
      axios.put(`http://localhost:5001/api/documents/${editingDoc._id}`, { field1, field2, field3 })
        .then(() => {
          fetchDocuments();
          resetForm();
        })
        .catch(error => console.error(error));
    } else {
      axios.post("http://localhost:5001/api/documents", { field1, field2, field3 })
        .then(response => {
          setDocuments([...documents, response.data]);
          resetForm();
        })
        .catch(error => console.error(error));
    }
  };  

  // Delete a document
  const handleDelete = (docId) => {
    axios.delete(`http://localhost:5001/api/documents/${docId}`)
      .then(() => setDocuments(documents.filter(doc => doc._id !== docId)))
      .catch(error => console.error(error));
  };

  // Edit a document
  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setField1(doc.field1 || "");
    setField2(doc.field2 || ""); 
    setField3(doc.field3 || "");
  };

  // Reset form
  const resetForm = () => {
    setField1("");
    setField2("");
    setField3("");
    setEditingDoc(null);
  };

  return (
    <div className="container">
      <button className="refresh-btn" onClick={fetchDocuments}>Refresh</button>
      <h1 className="title">Upstart Project Interview</h1>
      <form className="crud-form" onSubmit={handleSubmit}>
        <input
          className="input"
          value={field1}
          onChange={(e) => setField1(e.target.value)}
          placeholder="Field 1"
        />
        <input
          className="input"
          value={field2}
          onChange={(e) => setField2(e.target.value)}
          placeholder="Field 2"
        />
        <input
          className="input"
          value={field3}
          onChange={(e) => setField3(e.target.value)}
          placeholder="Field 3"
        />
        <button className="submit-btn" type="submit">
          {editingDoc ? "Update Document" : "Create Document"}
        </button>
        {editingDoc && <button className="cancel-btn" onClick={resetForm}>Cancel</button>}
      </form>
      <ul className="document-list">
        {documents.map(document => (
          <li key={document._id} className="document">
            <p><strong>Field 1:</strong> {document.field1}</p>
            <p><strong>Field 2:</strong> {document.field2}</p>
            <p><strong>Field 3:</strong> {document.field3}</p>
            <button className="edit-btn" onClick={() => handleEdit(document)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(document._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
