import React, { useEffect, useState } from 'react';
import { FiCheck, FiCheckCircle, FiEye, FiTrash2, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Pagination from '@/components/Services/Pagination';
import { getApiData, getSecureApiData, postApiData } from '../../Services/api';
import base_url from '../../baseUrl';
import Footer from '@/components/shared/Footer';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { CSVLink } from 'react-csv';

const Feedback = () => {
    const [isScam, setIsScam] = useState(false)
    const [disputeData, setDisputeData] = useState(null)
    const [allFeedback, setAllFeedback] = useState([]);
    const [format, setFormat] = useState('')
    const [scamType, setScamType] = useState('')
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const fetchFeedback = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `get-service-dispute?page=${pageNumber}`
            );

            if (result.status) {
                setAllFeedback(result.data || []);
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
            fetchFeedback();
        }, 500)

    }, [page, search, format, scamType]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== page) {
            setPage(pageNumber);
        }
    };
    const handleEdit = async (item) => {
        setDisputeData(item)
        setIsScam(true)
    }
    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {disputeData ?
                <div className='main-content'>
                    <div className="row mb-3">                       

                        <div className="col-sm-12">
                            <label>User</label>
                            <input type="text" className="form-control" value={disputeData?.userId?.firstName} disabled />
                        </div>

                        <div className="col-sm-12">
                            <label>Message</label>
                            <input type="text" className="form-control" value={disputeData?.message} disabled />
                        </div>
                        <div className='col-sm-3'>

                        <button className='btn btn-secondary' type='button' onClick={()=>setDisputeData(null)}>Back</button>
                        </div>
                    </div>
                </div>
                : <div className='main-content'>
                    <div className='row'></div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Feedback by registered users</h5>
                                <div className='d-flex gap-5'>

                                    <CSVLink
                                        data={allFeedback}
                                        // headers={headers}
                                        filename={"feedback.csv"}
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
                                            <th scope="col">Email</th>
                                            <th scope="col">Message</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col" className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allFeedback?.length > 0 ? (
                                                allFeedback?.map((cat, index) => {
                                                    return (
                                                        <tr key={cat._id}>
                                                            <td>{(page - 1) * 10 + index + 1}</td>
                                                            <td>{cat?.userId.email}</td>
                                                            <td>{cat?.message?.length>50? cat?.message?.slice(0,50)+ '...':cat?.message}</td>
                                                            <td>{new Date(cat?.createdAt)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })}</td>
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end gap-2">
                                                                    <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-light"><FiEye /></button>
                                                                    <Link to={cat?.userId?.role == 'provider' ? `/user/detail/${cat.userId._id}` : `/consumer/detail/${cat.userId._id}`} className="btn btn-success btn-sm btn-light text-white" >View User</Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>No feedback Found</td>
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

export default Feedback;
