import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Pagination from '@/components/Services/Pagination';
import { getApiData, getSecureApiData } from '../Services/api';
import base_url from '../baseUrl';
import Footer from '@/components/shared/Footer';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { CSVLink } from 'react-csv';

const AllUsers = () => {
    const [searchparam] = useSearchParams()
    const [userList, setUserList] = useState([]);
    const [page, setPage] = useState(1);
    const val = searchparam.get('data')
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [type,setType] =useState('consumer')
    const [data, setData] = useState('provider')

    const fetchUsers = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `get-all-users?page=${pageNumber}&search=${encodeURIComponent(searchQuery)}&type=${type}`
            );

            if (result.status) {
                setUserList(result.users || []);
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalUsers);
            }
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            fetchUsers();
        }, 500)

    }, [page, search, data,type]);
    useEffect(() => {
        if (val) {
            setData(val)
        }
    }, [val])

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
                        fetchUsers();
                    }
                } catch (error) {
                    console.log("error delete users", error)
                }
            }
        });
    }
    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            <div className='main-content'>
                <div className='row'></div>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Users</h5>
                            <div className='d-flex gap-5'>
                                <select className='form-select' value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="provider">Providers</option>
                                    <option value="consumer">Users</option>

                                </select>
                                <input type='search' placeholder='search here...' value={search}
                                    onChange={handleSearchChange} />
                                <CSVLink
                                    data={userList}
                                    // headers={headers}
                                    filename={"providers.csv"}
                                    className="btn btn-primary"
                                >
                                    Export as CSV
                                </CSVLink>
                            </div>
                        </div>
                        <div className="card-body table-responsive">
                            <table className="table table-hover table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">S.No.</th>
                                        <th scope="col">First name</th>
                                        <th scope="col">Last name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Contact Number</th>
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
                                                        <td className='text-capitalize'>{cat?.firstName}</td>
                                                        <td className=' text-capitalize'>{cat?.lastName}</td>
                                                        <td>{cat?.email}</td>
                                                        <td>{cat?.contactNumber}</td>
                                                        <td className="text-end">
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <Link to={cat?.onBoarding ? `/user/view/${cat._id}` : cat.role == 'consumer' ? `/consumer/detail/${cat._id}` : `/user/detail/${cat._id}`} className="btn btn-sm btn-light"><FiEye /></Link>
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
            </div>
            <Footer />
        </>
    );
};

export default AllUsers;
