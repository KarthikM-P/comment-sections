import React, { useState } from 'react';

function CommentBox() {
  const [comments, setComments] = useState([]);

  const addComment = (name, text) => {
    setComments([...comments, { id: Date.now(), name, text, replies: [] }]);
  };

  const addReply = (parentId, name, text) => {
    const addNestedReply = (commentsList) =>
      commentsList.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, { id: Date.now(), name, text, replies: [] }],
          };
        }
        return {
          ...comment,
          replies: addNestedReply(comment.replies),
        };
      });

    setComments(addNestedReply(comments));
  };

  const editComment = (id, newText) => {
    const updateCommentText = (commentsList) =>
      commentsList.map((comment) => {
        if (comment.id === id) return { ...comment, text: newText };
        return { ...comment, replies: updateCommentText(comment.replies) };
      });

    setComments(updateCommentText(comments));
  };

  const deleteComment = (id) => {
    const deleteNestedComment = (commentsList) =>
      commentsList.filter((comment) => {
        if (comment.id === id) return false;
        comment.replies = deleteNestedComment(comment.replies);
        return true;
      });

    setComments(deleteNestedComment(comments));
  };

  return (
    <div style={{ width: '50%', margin: '20px auto', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <CommentForm onSubmit={addComment} />
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onEdit={editComment}
          onReply={addReply}
          onDelete={deleteComment}
        />
      ))}
    </div>
  );
}

function CommentForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && name.trim()) {
      onSubmit(name, text);
      setText('');
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '10px', flexDirection: 'column' }}>
        <h1>comments</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        style={{ marginBottom: '8px', padding: '8px', borderRadius: '3px', border: '1px solid #ddd' }}
      />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        style={{ flex: 1, padding: '8px', marginBottom: '8px', borderRadius: '3px', border: '1px solid #ddd' }}
      />
      <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
        Submit
      </button>
    </form>
  );
}

function Comment({ comment, onEdit, onReply, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');

  const handleEdit = () => {
    onEdit(comment.id, editText);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(comment.id, replyName, replyText);
    setReplyText('');
    setReplyName('');
  };

  return (
    <div style={{ padding: '10px', borderTop: '1px solid #e0e0e0' }}>
      <p><strong>{comment.name}:</strong> {comment.text}</p>

      {isEditing ? (
        <div style={{ display: 'flex', marginTop: '5px' }}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ flex: 1, padding: '5px', border: '1px solid #ddd', borderRadius: '3px', marginRight: '5px' }}
          />
          <button onClick={handleEdit} style={{ padding: '5px 10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            Update
          </button>
        </div>
      ) : null}

      <button onClick={() => setIsEditing(!isEditing)} style={{ marginRight: '5px', padding: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
        Edit
      </button>
      <button onClick={() => onDelete(comment.id)} style={{ marginRight: '5px', padding: '5px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
        Delete
      </button>

      <div style={{ display: 'flex', marginTop: '5px', flexDirection: 'column' }}>
        <input
          type="text"
          value={replyName}
          onChange={(e) => setReplyName(e.target.value)}
          placeholder="Your name"
          style={{ marginBottom: '8px', padding: '5px', borderRadius: '3px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Reply..."
          style={{ flex: 1, padding: '5px', borderRadius: '3px', border: '1px solid #ddd', marginRight: '5px' }}
        />
        <button onClick={handleReply} style={{ padding: '5px 10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
          Reply
        </button>
      </div>

      {comment.replies.length > 0 && <h3 style={{ color: '#333', marginTop: '10px' }}>Replies:</h3>}
      <div style={{ marginLeft: '20px', borderLeft: '2px solid #ddd', paddingLeft: '10px' }}>
        {comment.replies.map((reply) => (
          <Reply
            key={reply.id}
            reply={reply}
            onEdit={onEdit}
            onReply={onReply}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function Reply({ reply, onEdit, onReply, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.text);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');

  const handleEdit = () => {
    onEdit(reply.id, editText);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(reply.id, replyName, replyText);
    setReplyText('');
    setReplyName('');
    setIsReplying(false);
  };

  return (
    <div style={{ padding: '10px', fontSize: '13px' }}>
        
      <p><strong>{reply.name}:</strong> {reply.text}</p>

      {isEditing ? (
        <div style={{ display: 'flex', marginTop: '5px' }}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ flex: 1, padding: '5px', borderRadius: '3px', border: '1px solid #ddd', marginRight: '5px' }}
          />
          <button onClick={handleEdit} style={{ padding: '5px 10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            Update
          </button>
        </div>
      ) : null}

      <button onClick={() => setIsEditing(!isEditing)} style={{ marginRight: '5px', padding: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
        Edit
      </button>
      <button onClick={() => onDelete(reply.id)} style={{ marginRight: '5px', padding: '5px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
        Delete
      </button>
      <button onClick={() => setIsReplying(!isReplying)} style={{ padding: '5px 10px', backgroundColor: '#5bc0de', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
        Reply
      </button>

      {isReplying && (
        <div style={{ display: 'flex', marginTop: '5px', flexDirection: 'column' }}>
          <input
            type="text"
            value={replyName}
            onChange={(e) => setReplyName(e.target.value)}
            placeholder="Your name"
            style={{ marginBottom: '8px', padding: '5px', borderRadius: '3px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add a reply..."
            style={{ flex: 1, padding: '5px', borderRadius: '3px', border: '1px solid #ddd', marginRight: '5px' }}
          />
          <button onClick={handleReply} style={{ padding: '5px 10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            Submit
          </button>
        </div>
      )}

      <div style={{ marginLeft: '20px', borderLeft: '2px solid #ddd', paddingLeft: '10px' }}>
        {reply.replies.length > 0 && <h3 style={{ color: '#555', marginTop: '10px' }}>Replies:</h3>}
        {reply.replies.map((subReply) => (
          <Reply
            key={subReply.id}
            reply={subReply}
            onEdit={onEdit}
            onReply={onReply}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentBox;
