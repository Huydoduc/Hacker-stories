import React from "react";
import "./App.css";

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

function App() {
  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const getAsyncStories = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
    );

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [stories, setStories] = React.useState([]);

  React.useEffect(() => {
    getAsyncStories().then((result) => {
      setStories(result.data.stories);
    });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );
    setStories(newStories);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        label="Search"
        value={searchTerm}
        onInputChange={handleSearch}
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr></hr>
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
}

// List component

const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => {
        return (
          <Item
            key={item.objectID}
            item={item}
            onRemoveItem={onRemoveItem}
          ></Item>
        );
      })}
    </ul>
  );
};

const Item = ({ item, onRemoveItem }) => {
  return (
    <li>
      <span>
        {" "}
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  );
};

//Search component

const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChange,
  children,
  isFocused,
}) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      ></input>
    </>
  );
};
export default App;
