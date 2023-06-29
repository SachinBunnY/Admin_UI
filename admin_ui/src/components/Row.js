import React from "react";

const Row = ({ data, handleDelete, index, handleEditClick, handleCheck }) => {
  //console.log(checkedData.value);
  return (
    <tr key={index + 1}>
      <input
        type="checkbox"
        value={data.id}
        checked={data?.isChecked || false}
        onChange={(e) => handleCheck(data, e)}
      ></input>
      <td>{data.name}</td>
      <td>{data.email}</td>
      <td>{data.role}</td>
      <td>
        <div>
          <button
            type="button"
            className="btn btn-secondary btn-sm mx-1"
            onClick={(e) => handleEditClick(e, data)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleDelete(data.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Row;
