import { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      <h1>Simple Blog</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"></textarea>
        <button type="submit">Submit</button>
      </form>
      <ul>
        {posts.map(post => (
          <li key={post._id}><h3>{post.title}</h3><p>{post.content}</p></li>
        ))}
      </ul>
    </div>
  );
}

export default App;
