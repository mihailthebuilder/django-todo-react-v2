import { useState, useEffect } from "react";
import CustomModal from "./components/Modal.js";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

const App = () => {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const refreshList = () => {
    axios
      .get("http://localhost:8000/api/todos/", { headers: headers })
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    refreshList();
  }, []);

  const displayCompleted = (status) => setViewCompleted(status);

  const renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? "active" : ""}
        >
          complete
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={viewCompleted ? "" : "active"}
        >
          incomplete
        </span>
      </div>
    );
  };

  const renderItems = () => {
    const newItems = todoList.filter(
      (item) => item.completed === viewCompleted
    );
    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => editItem(item)}
          >
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => handleDelete(item)}>
            Delete
          </button>
        </span>
      </li>
    ));
  };

  const toggle = () => {
    setModal((previousValue) => !previousValue);
  };

  const handleSubmit = (item) => {
    toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/todos/${item.id}`, item)
        .then((res) => refreshList());
    } else {
      axios
        .post("http://localhost:8000/api/todos/", item)
        .then((res) => refreshList());
    }
  };
  const handleDelete = (item) => {
    axios
      .delete(`http://localhost:8000/api/todos/${item.id}`)
      .then((res) => refreshList());
  };
  const createItem = () => {
    const item = {
      title: "",
      description: "",
      completed: false,
    };

    setActiveItem(item);
    toggle();
  };
  const editItem = (item) => {
    setActiveItem(item);
    toggle();
  };

  return (
    <main className="content">
      <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
      <div className="row ">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="">
              <button onClick={createItem} className="btn btn-primary">
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush">{renderItems()}</ul>
          </div>
        </div>
      </div>
      {modal && (
        <CustomModal
          activeItemProp={activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      )}
    </main>
  );
};

export default App;
