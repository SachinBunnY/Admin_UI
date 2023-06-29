import React from "react";

const InputRow = ({
  editData,
  handleEditDataChange,
  handleFormEditSubmit,
  handleCancelClick,
  handleCheck,
}) => {
  return (
    <tr key={editData.id}>
      <input
        type="checkbox"
        value={editData.id}
        checked={editData.isChecked}
        onChange={(e) => handleCheck(e)}
      ></input>
      <td>
        <input
          type="text"
          name="name"
          value={editData.name}
          onChange={handleEditDataChange}
        />
      </td>
      <td>
        <input
          type="text"
          name="email"
          value={editData.email}
          onChange={handleEditDataChange}
        />
      </td>
      <td>
        <input
          type="text"
          name="role"
          value={editData.role}
          onChange={handleEditDataChange}
        />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-secondary btn-sm mx-1"
          onClick={handleFormEditSubmit}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleCancelClick}
        >
          Cancel
        </button>
      </td>
    </tr>
  );
};
export default InputRow;
