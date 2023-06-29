import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import InputRow from "./components/InputRow";
import Row from "./components/Row";
import "bootstrap/dist/css/bootstrap.css";

const pageSize = 10;
let checkArr = [];
function App() {
  const [allData, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [text, setText] = useState("");
  const [isEditable, setIsEditable] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [checkedData, setCheckedData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const performAPI = async () => {
    try {
      const response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setData(response.data);
      setFilteredData(response.data);
      let data = response.data;
      setPaginationData(data.slice(0, pageSize));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    performAPI();
  }, []);

  useEffect(() => {
    let start = (currentPage - 1) * 10;
    let last = start + 10;
    setPaginationData(filteredData.slice(start, last));
    //console.log(checkedData);
    setCheckedData();
  }, [currentPage, filteredData]);

  useEffect(() => {
    handleChangeSearchBar(text);
  }, [text]);

  useEffect(() => {
    setFilteredData(newData);
  }, [newData]);

  const handleChangeSearchBar = (value) => {
    const result = allData.filter((data) => {
      if (
        data.name.includes(value) ||
        data.email.includes(value) ||
        data.role.includes(value)
      ) {
        return true;
      } else {
        return false;
      }
    });
    setFilteredData(result);
    setPaginationData(result.slice(0, 10));
  };
  const handleEditDataChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  /**This function is for delete each row  */
  const handleDelete = (id) => {
    const temp = [...filteredData];
    let index = filteredData.findIndex((data) => data.id === id);
    temp.splice(index, 1);
    setFilteredData(temp);
    let startIndex = (currentPage - 1) * pageSize;
    let lastIndex = startIndex + pageSize;
    setPaginationData(temp.slice(startIndex, lastIndex));
  };

  /**This function is for when you click on Edit button */
  const handleEditClick = (e, data) => {
    e.preventDefault();
    setIsEditable(data.id);
    const formValue = {
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setEditData(formValue);
  };

  const handleCancelClick = () => {
    setIsEditable(null);
  };

  /**This function is for when you save the edited data */
  const handleFormEditSubmit = (e) => {
    e.preventDefault();
    const editedData = {
      id: isEditable,
      name: editData.name,
      email: editData.email,
      role: editData.role,
    };
    const newEditedData = [...paginationData];
    const index = paginationData.findIndex((data) => data.id === isEditable);
    newEditedData[index] = editedData;
    setPaginationData(newEditedData);
    setIsEditable(null);
  };

  /**This function is for handling checkBox */
  const handleCheck = (data, e) => {
    console.log(data);
    const { checked, name, value } = e.target;
    if (name === "allSelect") {
      let arr = [];
      data?.map((item) => {
        arr.push(item.id);
      });
      console.log("data", arr);
      setCheckedData(arr);
      let tempUser = paginationData.map((user) => {
        return { ...user, isChecked: checked };
      });
      setPaginationData(tempUser);
    } else if (checked) {
      checkArr.push(value);
      setCheckedData(checkArr);
      let temp = paginationData.map((user) =>
        user.id === value ? { ...user, isChecked: checked } : user
      );
      setPaginationData(temp);
    } else {
      setCheckedData(checkedData.filter((e) => e !== value));
    }
  };

  /**This function is for deleting single, multiple and AllSelected Items */
  const DeleteSelectedItems = () => {
    let arr = [];
    console.log("checkData", checkedData);
    filteredData.map((data) => {
      console.log("data in filterData", data.id);
      if (checkedData.includes(data.id) === false) {
        console.log("data in checkData", data.id);
        arr.push(data);
      }
    });
    setNewData(arr);
    checkArr = [];
  };

  const totalPage = filteredData
    ? Math.ceil(filteredData.length / pageSize)
    : 0;
  //if (totalPage === 1) return null;
  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => i + start);
  };
  const pages = range(1, totalPage + 1);

  const handlePagination = (pageNo) => {
    setCurrentPage(pageNo);
    let startingIndex = (pageNo - 1) * pageSize;
    let endIndex = startingIndex + pageSize;
    setPaginationData(filteredData.slice(startingIndex, endIndex));
  };

  return (
    <form>
      <div className="App">
        <input
          type="text"
          placeholder="search by name, email or role"
          style={{ width: "100%", padding: "10px", margin: "8px" }}
          value={text}
          onChange={(e) => setText(e?.target?.value)}
        />
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  name="allSelect"
                  value={currentPage}
                  checked={
                    paginationData.filter((user) => user?.isChecked !== true)
                      .length < 1
                  }
                  onChange={(e) => handleCheck(paginationData, e)}
                ></input>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginationData.map((data, index) => (
              <>
                {isEditable === data.id ? (
                  <InputRow
                    editData={editData}
                    handleEditDataChange={handleEditDataChange}
                    handleFormEditSubmit={handleFormEditSubmit}
                    handleCancelClick={handleCancelClick}
                    handleCheck={handleCheck}
                  />
                ) : (
                  <Row
                    data={data}
                    index={index}
                    handleDelete={handleDelete}
                    handleEditClick={handleEditClick}
                    handleCheck={handleCheck}
                  />
                )}
              </>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="btn btn-sm btn-danger position-absolute start-0"
          onClick={DeleteSelectedItems}
        >
          Delete Selected
        </button>
        <div className="d-flex justify-content-center">
          <ul className="pagination">
            {pages.map((page) => {
              return (
                <li
                  key={page}
                  className={
                    page === currentPage ? "page-item active" : "page-item"
                  }
                  onClick={() => handlePagination(page)}
                >
                  <p className="page-link">{page}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </form>
  );
}

export default App;
