import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [documents, setDocuments] = useState([]);
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [editingDoc, setEditingDoc] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    axios.get("http://localhost:5001/api/documents")
      .then(response => {
        console.log("Receiving All Documents:", response.data); // Debugging
        setDocuments(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!field1.trim() || !field2.trim()) {
      setError("Both fields are required.");
      return;
    }

    setError("");
    console.log("Submitting Document:", { field1, field2 }); // Debugging

    if (editingDoc) {
      axios.put(`http://localhost:5001/api/documents/${editingDoc._id}`, { field1, field2 })
        .then((response) => {
          console.log(response);
          console.log("Document Updated:", { field1, field2 }); // Debugging
          fetchDocuments();
          resetForm();
        })
        .catch(error => console.error(error));
    } else {
      axios.post("http://localhost:5001/api/documents", { field1, field2 })
        .then(response => {
          console.log("Document Created:", response.data); // Debugging
          setDocuments([...documents, response.data]);
          resetForm();
        })
        .catch(error => console.error(error));
    }
  };

  // Delete a document
  const handleDelete = (docId) => {
    axios.get(`http://localhost:5001/api/documents/${docId}`)
      .then(response => {
        console.log("Deleting Document:", response.data); // Debugging
      })
      .catch(error => console.error(error));

    axios.delete(`http://localhost:5001/api/documents/${docId}`)
      .then(() => {
        console.log("Document Deleted:", docId); // Debugging
        setDocuments(documents.filter(doc => doc._id !== docId));
      })
      .catch(error => console.error(error));
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setField1(doc.field1);
    setField2(doc.field2);
  };

  const resetForm = () => {
    setField1("");
    setField2("");
    setEditingDoc(null);
    setError("");
  };

  return (
    <div className="container">
      <button className="refresh-btn" onClick={fetchDocuments}>Refresh</button>
      <h1 className="title">Upstart Project Interview</h1>
      <form className="crud-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
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
            <button className="edit-btn" onClick={() => handleEdit(document)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(document._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
