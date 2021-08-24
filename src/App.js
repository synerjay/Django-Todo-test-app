import { useEffect, useState } from 'react';
import Popup from './components/Popup';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function App() {
  // States
  const [viewCompleted, setViewCompleted] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: '',
    description: '',
    completed: false,
  });

  // Functions

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (item) => {
    toggle();
    if (item.id) {
      // UPDATE request
      axios.put(`/api/todos/${item.id}/`, item).then((res) => refreshList()); // with a payload
      return;
    }
    //CREATE request
    axios
      .post('/api/todos/', item, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => refreshList()); // if handleSubmit does not have an id, then will make post request
  };

  const handleDelete = (item) => {
    // DELETE request
    axios.delete(`/api/todos/${item.id}/`).then((res) => refreshList()); // from router class in rest_framework
  };

  const createItem = () => {
    const item = { title: '', description: '', completed: false };

    setActiveItem(item);
    setModal(!modal);
  };

  const editItem = (item) => {
    setActiveItem(item);
    setModal(!modal);
  };

  const displayCompleted = (status) => {
    if (status) {
      return setViewCompleted(true);
    }

    return setViewCompleted(false);
  };

  const renderTabList = () => (
    <div className='nav nav-tabs'>
      <span
        className={viewCompleted ? 'nav-link active' : 'nav-link'}
        onClick={() => displayCompleted(true)}
      >
        Complete
      </span>
      <span
        className={viewCompleted ? 'nav-link' : 'nav-link active'}
        onClick={() => displayCompleted(false)}
      >
        Incomplete
      </span>
    </div>
  );

  const renderItems = () => {
    const newItems = todoList.filter((item) => item.completed == viewCompleted);

    return newItems.map((item) => (
      <li
        key={item.id}
        className='list-group-item d-flex justify-content-between align-items-center'
      >
        <span
          className={`todo-title mr-2 ${viewCompleted ? 'completed-todo' : ''}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            className='btn btn-secondary mr-2'
            onClick={() => editItem(item)}
          >
            Edit
          </button>
          <button className='btn btn-danger' onClick={() => handleDelete(item)}>
            Delete
          </button>
        </span>
      </li>
    ));
  };

  const refreshList = () => {
    axios
      .get('/api/todos/') // READ request
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log(err));
  };

  // Mount refreshList function at start

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <div className='App'>
      <main className='container'>
        <h1 className='text-white text-uppercase text-center my-4'>Todo app</h1>
        <div className='row'>
          <div className='col-md-6 col-sm-10 mx-auto p-0'>
            <div className='card p-3'>
              <div className='mb-4'>
                <button className='btn btn-primary' onClick={createItem}>
                  Add task
                </button>
              </div>
              {renderTabList()}
              <ul className='list-group list-group-flush border-top-0'>
                {renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {modal ? (
          <Popup
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            toggle={toggle}
            onSave={handleSubmit}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
