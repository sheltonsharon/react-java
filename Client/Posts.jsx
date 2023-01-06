import React from "react";

const Posts = ({ posts, loading }) => {
  //   if (loading) {
  //     return <h2>Loading...</h2>;
  //   }
  return (
    <ul className="list-group mb-4">
      {posts.map((post) => (
        <li key={post.time} className="list-group-item App-link">
          Date and Time: {post.time}
          <br />
          Username: {post.username}
          <br />
          Commands: {post.commands}
        </li>
      ))}
    </ul>
  );
};

export default Posts;
