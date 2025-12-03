import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../Services/Pagination';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import base_url from '../../baseUrl';

const CustomersTable = () => {
    const [userList, setUserList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const fetchCustomers = async (pageNumber = page, searchQuery = search) => {
        try {
            const res = await axios.get(`${base_url}/api/users/all?page=${pageNumber}&q=${searchQuery}`);
            if (res.data.success) {
                setUserList(res.data.users || []);
                setPage(res.data.currentPage);
                setPages(res.data.totalPages);
                setTotal(res.data.totalUsers);
            }
        } catch (error) {
            console.log("error fetch users", error);
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, [page, search]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== page) {
            setPage(pageNumber);
        }
    };
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const handleDelete = (catId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${base_url}/api/users/delete/${catId}`,);
                    if (res.data.success) {
                        toast.success(res.data.message);
                        fetchCustomers();
                    }
                } catch (error) {
                    console.log("error delete users", error)
                }
            }
        });
    }
    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Users</h5>
                    <div>
                        <input type='search' placeholder='search here...' value={search}
                            onChange={handleSearchChange} />
                    </div>
                </div>
                <div className="card-body table-responsive">
                    <table className="table table-hover table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th scope="col"> S.No. </th>
                                <th scope="col">First name</th>
                                <th scope="col">Last name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Contact Number</th>
                                <th scope="col">Created At</th>
                                <th scope="col" className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userList?.length > 0 ? (
                                    userList?.map((cat, index) => {
                                        return (
                                            <tr key={cat._id}>
                                                <td>{(page - 1) * 10 + index + 1}</td>
                                                <td>{cat.firstName}</td>
                                                <td>{cat?.lastName}</td>
                                                <td>{cat?.email}</td>
                                                <td>{cat?.contactNumber}</td>
                                                <td>{new Date(cat?.createdAt).toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })}</td>
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <Link to={`/user/view/${cat._id}`} className="btn btn-sm btn-light"><FiEye /></Link>
                                                        <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(cat._id)}><FiTrash2 /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className='text-center'>No users Found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between align-items-center p-2">
                        <div className="text-muted">
                            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} entries
                        </div>
                        <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomersTable;
