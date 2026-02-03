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

const ServiceDispute = () => {
    const [isScam, setIsScam] = useState(false)
    const [disputeData, setDisputeData] = useState({})
    const [openDispute, setOpenDispute] = useState([]);
    const [resolution, setResolution] = useState('')
    const [format, setFormat] = useState('')
    const [scamType, setScamType] = useState('')
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const fetchDisputes = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `get-service-dispute?page=${pageNumber}`
            );

            if (result.status) {
                setOpenDispute(result.data || []);
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalAds);
            }
        } catch (error) {
            console.log("Error fetching scams:", error);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            fetchDisputes();
        }, 500)

    }, [page, search, format, scamType]);
    useEffect(() => {
        setResolution(disputeData.resolution)
    }, [disputeData])

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
                        fetchDisputes();
                    }
                } catch (error) {
                    console.log("error delete users", error)
                }
            }
        });
    }
    const handleEdit = async (item) => {
        setDisputeData(item)
        setIsScam(true)
    }
    async function handleAction(id) {
        const data = { disputeId: id, status: disputeData.status, resolution: disputeData.resolution }
        try {
            const result = await postApiData('dispute-action', data)
            if (result.success) {
                fetchDisputes()
                toast.success("Disput status is updated")
                setIsScam(false)
            } else {
                toast.error(result.message)
            }
        } catch (error) {

        }
    }
    const formattedData = openDispute.map(item => ({
        id: item.id,
        userId: item.userId?._id || item.userId || "",  // <-- extract the field you want
        against: item.against?.firstName,
        type: item.type,
        subject: item.subject,
        message: item.message,
        image: item.image,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        status: item.status,
    }));
    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {isScam ?
                <div className='main-content'>
                    <div className="row mb-3">

                        <Link style={{ cursor: "pointer" }} to={`/user/detail/${disputeData?.against?._id}`} className="col-sm-6 ">
                            <label>Against</label>
                            <input type="text" className="form-control" value={disputeData?.against?.firstName} disabled />
                            {/* <Link to={`/user/detail/${disputeData?.against?._id}`} className='btn-sm btn-success mb-2'>View</Link> */}
                        </Link>

                        <div className="col-sm-6">
                            <label>Type</label>
                            <input type="text" className="form-control" value={disputeData?.type} disabled />
                        </div>

                        <div className="col-sm-6">
                            <label>Subject</label>
                            <input type="text" className="form-control" value={disputeData?.subject} disabled />
                        </div>

                        <div className="col-sm-6">
                            <label>Message</label>
                            <textarea rows={5} className="form-control" value={disputeData?.message} disabled />
                        </div>

                        <div className="col-sm-6">
                            <label>Status</label>
                            <select
                                id="status"
                                name="status"
                                className="form-select"
                                value={disputeData?.status}
                                onChange={(e) => setDisputeData({ ...disputeData, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                {/* <option value="approved">Approve</option> */}
                                <option value="reject">Reject</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>

                        <div className="col-sm-6">
                            <label>Resolution</label>
                            <input
                                type="text"
                                className="form-control"
                                value={disputeData?.resolution}
                                // disabled={!!disputeData?.resolution}
                                onChange={(e) => setDisputeData({ ...disputeData, resolution: e.target.value })}
                            />
                        </div>

                        <div className="col-sm-6">
                            <label>Created At</label>
                            <input
                                type="text"
                                className="form-control"
                                value={disputeData?.createdAt ? new Date(disputeData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ""}
                                disabled
                            />
                        </div>

                        <div className="col-sm-6 d-flex flex-column">
                            <label>Image</label>
                            {disputeData?.image && (
                                disputeData.image.toLowerCase().endsWith(".pdf") ? (
                                    <div>
                                        <iframe
                                            src={`${base_url}/${disputeData.image}`}
                                            width="100%"
                                            height="500px"
                                            title="Dispute PDF"
                                        />
                                       
                                    </div>
                                ) : (
                                    <img
                                        className="img-fluid"
                                        src={`${base_url}/${disputeData.image}`}
                                        width={400}
                                        height={250}
                                        alt="Dispute evidence"
                                    />
                                )
                            )}

                        </div>
                        {disputeData?.status !== 'payment-pending' && <>
                            <h4>Service Detail</h4>
                            <div className="col-sm-6">
                                <label>Service Use</label>
                                <input type="text" className="form-control" value={disputeData?.addOnId?.name} disabled />
                            </div>
                            <div className="col-sm-6">
                                <label>Service Type</label>
                                <input type="text" className="form-control" value={disputeData?.addOnId?.type} disabled />
                            </div>
                            <div className="col-sm-6">
                                <label>Paid Price</label>
                                <input type="text" className="form-control" value={disputeData?.addOnPrice} disabled />
                            </div>
                        </>}

                    </div>
                    <div className="col-12 pb-5 d-flex justify-content-between">
                        <button onClick={() => setIsScam(false)} className='btn btn-secondary'>Back</button>
                        {/* {!disputeData?.resolution && ( */}
                        <button onClick={() => handleAction(disputeData._id)} className='btn btn-success'>
                            Update
                        </button>
                        {/* )} */}
                    </div>
                </div>

                : <div className='main-content'>
                    <div className='row'></div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Service Disputes</h5>
                                <div className='d-flex gap-5'>
                                    <CSVLink
                                        data={formattedData}
                                        filename={"service-dispute.csv"}
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
                                            <th scope="col">Date</th>
                                            <th scope="col">Service Dispute Id</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Against Type</th>
                                            <th scope="col">Status</th>

                                            <th scope="col" className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            openDispute?.length > 0 ? (
                                                openDispute?.map((cat, index) => {
                                                    return (
                                                        <tr key={cat._id}>
                                                            <td>{(page - 1) * 10 + index + 1}</td>
                                                            <td>{new Date(cat?.createdAt)?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                            <td>{cat?.customId || cat?._id?.slice(-6)}</td>
                                                            <td>{cat?.userId?.firstName+' '+cat?.userId?.lastName}</td>
                                                            <td>{cat?.against?.firstName+' '+cat?.against?.lastName}</td>
                                                            <td>{cat?.status}</td>
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end gap-2">
                                                                    <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-light"><FiEye /></button>
                                                                    {/* {cat.status === 'pending' && <button title='Solved' className="btn btn-success btn-sm btn-light text-white" onClick={() => handleAction(cat._id)}><FiCheckCircle size={10} /></button>} */}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>No service dispute Found</td>
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

export default ServiceDispute;
