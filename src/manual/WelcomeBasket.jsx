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

const WelcomeBasket = () => {
    const [isScam, setIsScam] = useState(false)
    const [status, setStatus] = useState('Requested')
    const [scamData, setScamData] = useState(null)
    const [userList, setUserList] = useState([]);
    const [scamType, setScamType] = useState('')
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const fetchUsers = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `welcome-basket?page=${pageNumber}`
            );

            if (result.status) {
                setUserList(result.welcomeBasket || []);
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalBasket);
            }
        } catch (error) {
            console.log("Error fetching scams:", error);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            fetchUsers();
        }, 500)

    }, [page, search, scamType, status]);

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
        setScamData(item)
        setIsScam(true)
    }
    async function handleAction() {
        const data = { basketId: scamData?._id, status :scamData?.status}
        try {
            const result = await postApiData('basket-action', data)
            if (result.status) {
                toast.success("Basket status is updated")
                setScamData(null)
                fetchUsers()
            } else {
                toast.error(result.message)
            }
        } catch (error) {

        }
    }
    async function handlePostingAction() {
        const data = { reportId: scamData?._id, status: scamData?.status, severity: scamData?.severity }
        try {
            const result = await postApiData('scam-report-action', data)
            if (result.success) {
                toast.success("Report status is updated")
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
             {scamData?
             <div className='main-content'><div className="row mb-3">
                    <div className="col-sm-6">
                        <label htmlFor='name'>Name</label>
                        <input id='name' type="text" className="form-control" value={scamData?.userId?.firstName+' '+scamData?.userId?.lastName}
                         disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Area</label>
                        <textarea row={5} id='name' type="text" className="form-control" value={scamData?.area} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Address</label>
                        <input id='name' type="text" className="form-control" value={scamData?.address} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Contact Number</label>
                        <input id='name' type="text" className="form-control" value={scamData?.phone} disabled />
                    </div>
                    <div className="col-sm-6 d-flex flex-column">
                        <label htmlFor='name'>Status </label>
                        <select className='form-select' value={scamData?.status} onChange={(e) => setScamData({ ...scamData, status: e.target.value })}>
                            {/* <option value="">Select</option> */}
                            <option value="Requested">Requested</option>
                            <option value="On the way">On the Way</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                </div>
                    <div className="d-flex justify-content-between">
                        <button onClick={() => setScamData(null)} className='btn btn-secondary'>Back</button>
                        <button onClick={() => handleAction()} className='btn btn-success'>Save</button>

                    </div>
                </div>
             :<div className='main-content'>
                    <div className='row'></div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Welcome Basket</h5>
                                {/* <div className='d-flex gap-5'>                                   
                                    
                                    <select className='form-select' value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="Requested">Requested</option>
                                        <option value="On the way">On the way</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                    
                                </div> */}
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-hover table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">S.No.</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">Status</th>
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
                                                            <td>{cat?.userId?.firstName + ' ' + cat?.userId?.lastName}</td>
                                                            <td>{cat?.userId?.email}</td>
                                                            <td>{cat?.address}</td>
                                                            <td>{cat?.status}</td>
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end gap-2">
                                                                    <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-light"><FiEye /></button>
                                                                    {/* {cat?.status == 'Requested' && 
                                                                        <button title='On the Way' className="btn btn-warning btn-sm btn-light text-white" onClick={() => handleAction(cat._id, 'On the way')}><FiCheckCircle size={10} /></button>}
                                                                        {cat?.status == 'On the way' && <button title='Delivered' className="btn btn-success btn-sm btn-light text-white" onClick={() => handleAction(cat._id, 'Delivered')}><FiXCircle /></button>
                                                                    } */}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>No basket request Found</td>
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

export default WelcomeBasket;
