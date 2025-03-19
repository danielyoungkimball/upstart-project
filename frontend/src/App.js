import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5001/api/posts")
      .then(response => setPosts(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/api/posts", { title, content })
      .then(response => setPosts([...posts, response.data]))
      .catch(error => console.error(error));
  };

  return (
    <div className="container">
      <h1 className="title">Simple Form</h1>
      <form className="blog-form" onSubmit={handleSubmit}>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <button className="submit-btn" type="submit">Submit</button>
      </form>
      <ul className="post-list">
        {posts.map(post => (
          <li key={post._id} className="post">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
