import React, { useEffect, useState } from 'react';
import './teacherUserlist.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacher } from '../../axios/teacher.js/teacherServers';
import { toast } from 'react-toastify';
import Loader from './Loader';
import { Form, Col, Row } from 'react-bootstrap';
import Pagination from './Pagination'; // Correct the Pagination import path

const TeacherUserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const dispatch = useDispatch();
  const { teachers_list: teachers, status, error } = useSelector((state) => state.teacher); // Adjust selector to match the state structure in teacherSlice

  useEffect(() => {
    dispatch(fetchTeacher()); // Dispatch the fetchTeacherList action
  }, [dispatch]);

  const filteredTeachers = teachers
    ? teachers.filter((teacher) =>
        teacher.first_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexofFirstUser = indexOfLastUser - usersPerPage;
  const currentTeachers = filteredTeachers.slice(indexofFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (error && error.trim().length > 0) {
      toast.error(error);
    }
  }, [error]);

  if (status === 'loading') {
    return <Loader />;
  }

  const sortedTeachers = [...currentTeachers].sort((a, b) => a.id - b.id);

  return (
    <div className='teacher-table'>
      <h1>Teacher Management</h1>
      <Row className='mx-2 my-2'>
        <Col sm={9}></Col>
        <Col sm={3}>
          <Form.Control
            type='text'
            placeholder='Search Teachers'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
      </Row>
      <Table striped bordered hover className='text-center'>
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeachers.map((teacher, index) => (
            <tr key={teacher.id}>
              <td>{indexofFirstUser + index + 1}</td>
              <td>
                {teacher.first_name
                  ? teacher.first_name + ' ' + teacher.last_name
                  : <span className='text-secondary'>-NA-</span>}
              </td>
              <td>{teacher.email}</td>
              <td>
                {teacher.is_active
                  ? <span className='text-success'>Active</span>
                  : <span className='text-danger'>InActive</span>}
              </td>
              <td>
                <Link to={`/teacher/user/${teacher.id}/`}>
                  <Button
                    className='p-1 m-1 text-light'
                    style={{ backgroundColor: '#12A98E' }}
                    variant=''
                  >
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        itemsPerPage={usersPerPage}
        totalItems={filteredTeachers.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default TeacherUserList;