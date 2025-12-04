import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiEye, FiTrash2, FiXCircle } from 'react-icons/fi';
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
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Advertisement = () => {
    const [adList, setAdList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [adData, setAdData] = useState(null)
    const [occupiedDates, setOccupiedDates] = useState([])

    const fetchAds = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `ads?page=${pageNumber}`
            );

            if (result.status) {
                setAdList(result.data || []);
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalAds);
            }
        } catch (error) {
            console.log("Error fetching ads:", error);
        }
    };
    const fetchOccupied = async () => {
        try {
            const result = await getApiData(`occupied-dates`);

            if (result.status) {
                const dates = result.occupiedDates.map(d => new Date(d));
                setOccupiedDates(dates);
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.log("Error fetching ads:", error);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            fetchAds();
        }, 500)

    }, [page, search]);
    useEffect(() => {
        fetchOccupied()
    }, [])

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== page) {
            setPage(pageNumber);
        }
    };
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    async function handleAction(id, status) {
        const data = { adId: id, status }
        try {
            const result = await postApiData('ad-action', data)
            if (result.success) {
                fetchAds()
                toast.success("Ad status is updated")
            } else {
                toast.error(result.message)
            }
        } catch (error) {

        }
    }
    async function handleAdSubmit(e) {
        e.preventDefault()
        if (new Date(adData?.startDate) > new Date(adData?.endDate)) {
            toast.error('Start Date must be less then end date')
            return
        }
        const data = new FormData()
        data.append('adImage', adData?.adImage)
        data.append('adDesc', adData?.adDesc)
        data.append('amount', adData?.amount)
        data.append('startDate', adData?.startDate)
        data.append('endDate', adData?.endDate)
        data.append('adId', adData?._id)

        try {
            const response = await postApiData('advertisement', data)
            if (response.status) {
                toast.success("Data updated")
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    const formatDate = (date) =>
        date ? new Date(date).toISOString().split("T")[0] : "";

    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {adData ?
                <form onSubmit={handleAdSubmit} className='main-content'>
                    <div className="row mb-3">
                        <div className="col-sm-6">
                            <label htmlFor='name'>Account Name</label>
                            <input id='name' type="text" className="form-control" value={adData?.accountName} disabled />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Email</label>
                            <input id='name' type="text" className="form-control" value={adData?.email} disabled />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Spot</label>
                            <input id='name' type="text" className="form-control" value={adData?.spot} disabled />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Contact Number</label>
                            <input id='name' type="text" className="form-control" value={adData?.contactNumber} disabled />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Submit on </label>
                            <input id='name' type="text" className="form-control" value={new Date(adData?.createdAt)?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} disabled />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Description</label>
                            <textarea row={10} id='name' type="text" className="form-control" value={adData?.detail} disabled />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Status</label>
                            <input id='name' type="text" className="form-control text-capitalize" value={adData?.status} disabled />
                        </div>
                        <div className="col-sm-6 d-flex flex-column">
                            <label htmlFor='name'>Image </label>
                            <img className='img-fluid' src={`${base_url}/${adData?.image}`} width={400} height={250} />
                        </div>
                        {(adData?.status !== 'under-review' && adData?.status !== 'declined') && <>
                            <div className="col-sm-6">
                                <label htmlFor='name'>Ad Image</label>
                                <input type='file' className="form-control" required={!adData?.adImage} onChange={(e) => setAdData({ ...adData, adImage: e.target.files[0] })} disabled={adData?.status !== 'approve'} />
                            </div>
                            {adData?.adImage && <img
                                src={
                                    adData?.adImage instanceof File
                                        ? URL.createObjectURL(adData.adImage)   
                                        : `${base_url}/${adData?.adImage}`
                                }
                                alt="Ad Preview"
                                style={{ width: "220px", height: "120px", objectFit: "cover" }}
                            />}

                            <div className="col-sm-6 d-flex flex-column">
                                <label htmlFor='name'>Start Date</label>
                                {/* <input type='date' value={adData?.startDate}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(e) => setAdData({ ...adData, startDate: e.target.value })} required className="form-control"
                                     disabled={adData?.status !== 'approve'} /> */}
                                <DatePicker
                                    selected={adData.startDate}
                                    onChange={date => setAdData({ ...adData, startDate: date })}
                                    minDate={new Date()} // today
                                    excludeDates={occupiedDates} // disable occupied dates
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                    disabled={adData.status !== "approve"}
                                />
                            </div>
                            <div className="col-sm-6 d-flex flex-column">
                                <label htmlFor='name'>End Date</label>
                                <DatePicker
                                    selected={adData.endDate}
                                    onChange={date => setAdData({ ...adData, endDate: date })}
                                    minDate={new Date()} // today
                                    excludeDates={occupiedDates} // disable occupied dates
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                    disabled={adData.status !== "approve"}
                                />
                                {/* <input type='date' value={adData?.endDate}
                                    min={
                                        adData?.startDate
                                            ? new Date(new Date(adData.startDate).getTime() + 24 * 60 * 60 * 1000)
                                                .toISOString()
                                                .split("T")[0]
                                            : new Date().toISOString().split("T")[0]
                                    }
                                    onChange={(e) => setAdData({ ...adData, endDate: e.target.value })} required className="form-control" disabled={adData?.status !== 'approve'} /> */}
                            </div>
                            <div className="col-sm-6">
                                <label htmlFor='name'>Ad Description</label>
                                <textarea row={10} id='name' type="text" required onChange={(e) => setAdData({ ...adData, adDesc: e.target.value })} className="form-control" value={adData?.adDesc} disabled={adData?.status !== 'approve'} />
                            </div>
                            <div className="col-sm-6">
                                <label htmlFor='name'>Amount</label>
                                <input type='number' className="form-control" required name='amount' value={adData?.amount} onChange={(e) => setAdData({ ...adData, amount: e.target.value })} disabled={adData?.status !== 'approve'} />
                            </div>
                        </>}
                    </div>
                    <div className="d-flex justify-content-between">
                        <button onClick={() => setAdData(null)} className='btn btn-secondary'>Back</button>
                        {adData?.status == 'approve' && <button type='submit' className='btn btn-primary'>Submit</button>}

                    </div>
                </form> : <div className='main-content'>
                    <div className='row'></div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Advertisement</h5>
                                <div className='d-flex gap-5'>
                                    {/* <input type='search' placeholder='search here...' value={search}
                                    onChange={handleSearchChange} /> */}
                                    <CSVLink
                                        data={adList}
                                        // headers={headers}
                                        filename={"advertisement.csv"}
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
                                            <th scope="col">Account name</th>
                                            <th scope="col">Spot</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Status</th>
                                            <th scope="col" className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            adList?.length > 0 ? (
                                                adList?.map((cat, index) => {
                                                    return (
                                                        <tr key={cat._id}>
                                                            <td>{(page - 1) * 10 + index + 1}</td>
                                                            <td className='text-capitalize'>{cat?.accountName}</td>
                                                            <td className=' text-capitalize'>{cat?.spot}</td>
                                                            <td>{cat?.email}</td>
                                                            <td className='text-capitalize'>{cat?.status}</td>
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end gap-2">
                                                                    <button onClick={() => setAdData({ ...cat, startDate: formatDate(cat.startDate), endDate: formatDate(cat.endDate) })}
                                                                        className="btn btn-sm btn-light"><FiEye /></button>
                                                                    {/* <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(cat._id)}><FiTrash2 /></button> */}
                                                                    {cat?.status == 'under-review' && <>
                                                                        <button title='Approve' className="btn btn-success btn-sm btn-light text-white" onClick={() => handleAction(cat._id, 'approve')}><FiCheckCircle size={10} /></button>
                                                                        <button title='Declined' className="btn btn-danger btn-sm btn-light text-white" onClick={() => handleAction(cat._id, 'declined')}><FiXCircle /></button>
                                                                    </>}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>No ads Found</td>
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

export default Advertisement;
