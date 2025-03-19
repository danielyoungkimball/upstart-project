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

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/documents");
      console.log("Receiving All Documents:", response.data); // Debugging
      setDocuments(response.data);
    } catch (err) {
      setError("Failed to fetch documents. Try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!field1.trim() || !field2.trim()) {
      setError("Both fields are required.");
      return;
    }

    setError("");

    try {
      if (editingDoc) {
        const response = await axios.put(`http://localhost:5001/api/documents/${editingDoc._id}`, { field1, field2 });
        console.log("Updating Document:", response.data); // Debugging
      } else {
        const response = await axios.post("http://localhost:5001/api/documents", { field1, field2 });
        console.log("Creating Document:", response.data); // Debugging
      }
      resetForm();
    } catch (err) {
      setError("Failed to save document. Please try again.");
    } finally {
      fetchDocuments();
    }
  };

  const handleDelete = async (docId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/documents/${docId}`);
      console.log("Deleting Document:", response.data); // Debugging
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== docId));
    } catch (err) {
      setError("Failed to delete document. Please try again.");
    } finally {
      fetchDocuments();
    }
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setField1(doc.field1);
    setField2(doc.field2);
    setError("");
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
        {documents.map((document) => (
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
