// src/components/ClassRoomForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClassRoom, editClassRoom } from '../../axios/admin/AdminServers';


const ClassRoomForm = ({ editingClassRoom, setEditingClassRoom }) => {
  const [classRoomData, setClassRoomData] = useState(editingClassRoom || { class_no: '', section: '', class_teacher: '' });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassRoomData({ ...classRoomData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClassRoom) {
      dispatch(editClassRoom({ id: editingClassRoom.id, classRoomData }));
    } else {
      dispatch(addClassRoom(classRoomData));
    }
    setClassRoomData({ class_no: '', section: '', class_teacher: '' });
    setEditingClassRoom(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        name="class_no"
        value={classRoomData.class_no}
        onChange={handleChange}
        placeholder="Class Number"
      />
      <input
        type="text"
        name="section"
        value={classRoomData.section}
        onChange={handleChange}
        placeholder="Section"
      />
      <input
        type="text"
        name="class_teacher"
        value={classRoomData.class_teacher}
        onChange={handleChange}
        placeholder="Class Teacher"
      />
      <button type="submit">{editingClassRoom ? 'Edit ClassRoom' : 'Add ClassRoom'}</button>
    </form>
  );
};

export default ClassRoomForm;
