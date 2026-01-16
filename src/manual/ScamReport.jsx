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
import Loader from '../layout/Loader';

const ScamReport = () => {
    const [isScam, setIsScam] = useState(false)
    const [status, setStatus] = useState('all')
    const [scamData, setScamData] = useState({})
    const [userList, setUserList] = useState([]);
    const [format, setFormat] = useState('')
    const [scamType, setScamType] = useState('')
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading,setLoading] =useState(false)

    const fetchUsers = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `get-report-scam?page=${pageNumber}&search=${encodeURIComponent(searchQuery)}&type=${format}&scamType=${scamType}&status=${status}`
            );

            if (result.status) {
                setUserList(result.scams || []);
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalScams);
            }
        } catch (error) {
            console.log("Error fetching scams:", error);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            fetchUsers();
        }, 500)

    }, [page, search, format, scamType, status]);

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
    async function handleAction(id, status) {
        const data = { reportId: id, status }
        setLoading(true)
        try {
            const result = await postApiData('scam-report-action', data)
            if (result.success) {
                fetchUsers()
                toast.success("Report status is updated")
            } else {
                toast.error(result.message)
            }
        } catch (error) {

        } finally{
            setLoading(false)
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
    const downloadImage = async (path) => {
        try {
            const response = await fetch(`${base_url}/${path}`, { mode: 'cors' });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = scamData.title; // or specify a filename
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed', error);
        }
    };
    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {loading?<Loader/>
            :isScam ?
                <div className='main-content'><div className="row mb-3">
                    <div className="col-sm-6">
                        <label htmlFor='name'>Title</label>
                        <input id='name' type="text" className="form-control" value={scamData?.title} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Description</label>
                        <textarea row={5} id='name' type="text" className="form-control" value={scamData?.description} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Format</label>
                        <input id='name' type="text" className="form-control" value={scamData?.format} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Scam Type</label>
                        <input id='name' type="text" className="form-control" value={scamData?.scamType?.name} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Service Category</label>
                        <input id='name' type="text" className="form-control" value={scamData?.serviceCategory?.name} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Amount of Money Lost</label>
                        <input id='name' type="text" className="form-control" value={scamData?.amountOfLost} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Date Reported to Wizbizla </label>
                        <input id='name' type="text" className="form-control" value={new Date(scamData?.dateReported)?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Name</label>
                        <input id='name' type="text" className="form-control" value={scamData?.name} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Reported To Authorities</label>
                        <input id='name' type="text" className="form-control" value={scamData?.reportedAuthorities ? 'Yes' : 'No'} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Reported To Whom</label>
                        <input id='name' type="text" className="form-control" value={scamData?.reportedToWhom} disabled />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Scam Submit on </label>
                        <input id='name' type="text" className="form-control" value={new Date(scamData?.createdAt)?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} disabled />
                    </div>
                    <div className="col-sm-6 d-flex flex-column">
                        <label htmlFor='name'>Image </label>
                        {scamData?.image.toLowerCase().endsWith('.pdf') ? (
                            // If it's a PDF, show a link or embedded viewer
                            <iframe
                                src={`https://api.wizbizlaonboard.com/${scamData.image}`}
                                width="100%"
                                height="500px"
                                title="License PDF"
                            />
                        ) :<>
                            <img className='img-fluid' src={`${base_url}/${scamData?.image}`} style={{ width: '350px', height: '300px' }} />
                        {scamData?.image && <button className="btn btn-primary w-25" onClick={() => downloadImage(scamData.image)}>
                            Download
                        </button>}
                        </>
                        }
                    </div>
                    <div className="col-sm-6 d-flex flex-column">
                        <label htmlFor='name'>Severity </label>
                        <select className='form-select' value={scamData?.severity} onChange={(e) => setScamData({ ...scamData, severity: e.target.value })}>
                            {/* <option value="">Select</option> */}
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>

                        </select>
                    </div>
                    <div className="col-sm-6 d-flex flex-column">
                        <label htmlFor='name'>Status </label>
                        <select className='form-select' value={scamData?.status} onChange={(e) => setScamData({ ...scamData, status: e.target.value })}>
                            {/* <option value="">Select</option> */}
                            <option value="pending">Pending</option>
                            <option value="live">Approved</option>
                            <option value="declined">Declined</option>
                        </select>
                    </div>
                </div>
                    <div className="d-flex justify-content-between">
                        <button onClick={() => setIsScam(false)} className='btn btn-secondary'>Back</button>
                        <button onClick={() => handlePostingAction()} className='btn btn-success'>Save</button>

                    </div>
                </div>
                : <div className='main-content'>
                    <div className='row'></div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Scam Reports</h5>
                                <div className='d-flex gap-5'>
                                    <select className='form-select' value={format} onChange={(e) => setFormat(e.target.value)}>
                                        <option value="">All Format</option>
                                        <option value="Online">Online</option>
                                        <option value="At a shop">At a shop</option>
                                        <option value="At Home">At Home</option>
                                        <option value="At Work">At Work</option>
                                    </select>
                                    <select className='form-select' value={scamType} onChange={(e) => setScamType(e.target.value)}>
                                        <option value="">All Type</option>
                                        <option value="Phishing">Phishing</option>
                                        <option value="Investment Fraud">Investment Fraud</option>
                                        <option value="Online Shopping Scam">Online Shopping Scam</option>
                                        <option value="Job Scam">Job Scam</option>
                                    </select>
                                    <select className='form-select' value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="all">Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="live">Live</option>
                                        <option value="approved">Approved</option>
                                    </select>
                                    <input type='search' placeholder='search here...' value={search}
                                        onChange={handleSearchChange} />
                                    <CSVLink
                                        data={userList}
                                        // headers={headers}
                                        filename={"scams.csv"}
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
                                            <th scope="col">Title</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Scam Type</th>
                                            <th scope="col">Format</th>
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
                                                            <td>{cat?.title}</td>
                                                            <td>{cat?.name}</td>
                                                            <td>{cat?.scamType?.name}</td>
                                                            <td>{cat?.format}</td>
                                                            <td className='text-capitalize'>{cat?.status}</td>
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end gap-2">
                                                                    <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-light"><FiEye /></button>
                                                                    {cat?.status == 'pending' && <>
                                                                        <button title='Approve' className="btn btn-success btn-sm btn-light text-white" onClick={() => handleAction(cat._id, 'live')}><FiCheckCircle size={10} /></button>
                                                                        <button title='Declined' className="btn btn-danger btn-sm btn-light text-white" onClick={() => handleAction(cat._id, 'declined')}><FiXCircle /></button>
                                                                    </>}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>No scams Found</td>
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

export default ScamReport;
