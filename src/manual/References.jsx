import React, { useEffect, useState } from 'react';
import { FiCheck, FiCheckCircle, FiEye, FiTrash2, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Pagination from '@/components/Services/Pagination';
import { getApiData, getSecureApiData, postApiData } from '../Services/api';
import base_url from '../baseUrl';
import Footer from '@/components/shared/Footer';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { CSVLink } from 'react-csv';

const References = () => {
    const [isScam, setIsScam] = useState(false)
    const [refData, setRefData] = useState({})
    const [userList, setUserList] = useState([]);
    const [status, setStatus] = useState('pending')
    const [format, setFormat] = useState('')
    const [scamType, setScamType] = useState('')
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const fetchUsers = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `trusted-reference?page=${pageNumber}`
            );

            if (result.status) {
                setUserList(result.data || []);
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalRef);
            }
        } catch (error) {
            console.log("Error fetching scams:", error);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            fetchUsers();
        }, 500)

    }, [page, search, format, scamType]);

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
    const handleEdit = async (item) => {
        setRefData(item)
        setIsScam(true)
    }
    async function handleAction() {
        const data = { refId: refData._id, status:refData.status,comment:refData.comment }
        try {
            const result = await postApiData('reference-action', data)
            if (result.success) {
                toast.success("Reference status is updated")
            } else {
                toast.error(result.message)
            }
        } catch (error) {

        }
    }
    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {isScam ?
                <div className='main-content'><div className="row mb-3">
                    <div className="col-sm-6">
                        <label htmlFor='name'>Reference User</label>
                        <input id='name' type="text" className="form-control" value={refData?.referenceUser?.firstName + "  " + refData?.referenceUser?.lastName} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Requestd User</label>
                        <input id='name' type="text" className="form-control" value={refData?.userId?.firstName + "  " + refData?.userId?.lastName} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Status</label>
                        <select id='name' name='status' type="text" className="form-select" value={refData.status} onChange={(e) => setRefData({...refData,status: e.target.value})}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approve</option>
                            <option value="cancel">Cancel</option>
                        </select>
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Comment</label>
                        <input id='name' type="text" className="form-control" value={refData?.comment} name='comment'  onChange={(e) => setRefData({...refData,comment:e.target.value})}/>
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Requested Date </label>
                        <input id='name' type="text" className="form-control" value={new Date(refData?.createdAt)?.toLocaleDateString()} disabled />
                    </div>

                </div>
                <div className='d-flex justify-content-between'>

                    <button onClick={() => setIsScam(false)} className='btn btn-secondary'>Back</button>
                    <button onClick={() => handleAction()} className='btn btn-success'>Update</button>
                </div>
                </div>
                : <div className='main-content'>
                    <div className='row'></div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Provider References</h5>
                                <div className='d-flex gap-5'>

                                    {/* <input type='search' placeholder='search here...' value={search}
                                    onChange={handleSearchChange} /> */}
                                    <CSVLink
                                        data={userList}
                                        // headers={headers}
                                        filename={"references.csv"}
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
                                            <th scope="col">Reference User</th>
                                            <th scope="col">Requested User</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Date</th>
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
                                                            <td>{cat?.referenceUser?.firstName} {cat?.referenceUser?.lastName}</td>
                                                            <td>{cat?.userId?.firstName} {cat?.userId?.lastName}</td>
                                                            <td>{cat?.status}</td>
                                                            <td>{new Date(cat?.createdAt)?.toLocaleDateString()}</td>
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end gap-2">
                                                                    <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-light"><FiEye /></button>
                                                                    {/* <button title='Approve' className="btn btn-success btn-sm btn-light text-white" onClick={() => handleAction(cat._id,'live')}><FiCheckCircle size={10}/></button>
                                                                <button title='Declined' className="btn btn-danger btn-sm btn-light text-white" onClick={() => handleAction(cat._id,'declined')}><FiXCircle /></button> */}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>No references Found</td>
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
                </div>}
            <Footer />
        </>
    );
};

export default References;
