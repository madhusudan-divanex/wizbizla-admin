import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiEye, FiTrash2, FiXCircle } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
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
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import Loader from '../layout/Loader';
const Advertisement = () => {
    const [searchParams] = useSearchParams();
    const listParam = searchParams.get('list');
    const [adList, setAdList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('requested')
    const [adData, setAdData] = useState(null)
    const [calendarDate, setCalanderDate] = useState()
    const [occupiedDates, setOccupiedDates] = useState([])
    const [loading,setLoading] =useState(false)

    const fetchAds = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `ads?page=${pageNumber}&status=approve`
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
            const result = await getApiData(`occupied-dates/${adData?.spot}`);

            if (result.status) {
                const dates = result.occupiedDates.map(d => new Date(d));

                setOccupiedDates(dates);
            } else {
                setOccupiedDates([])
                // toast.error(result.message)
            }
        } catch (error) {
            console.log("Error fetching ads:", error);
        }
    };
    const tileClassName = ({ date }) => {
        if (occupiedDates?.includes(date.toDateString())) {
            return "occupied-date"; // CSS class
        }
        return "";
    };

    useEffect(() => {
        fetchAds();

    }, [page, status]);
    useEffect(() => {
        if (adData  && adData?.spot) {

            fetchOccupied()
        }
    }, [adData])

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
        if (!adData?.startDate || !adData?.endDate) {
            toast.error('Start and end date is required')
            return
        }
        setLoading(true)
        const data = new FormData()
        data.append('adId', adData?._id)
        Object.entries(adData).forEach(([key, value]) => {
            data.append(key, value);
        });

        try {
            const response = await postApiData('advertisement', data)
            if (response.status) {
                fetchAds()
                fetchOccupied()
                setAdData(response.data)
                setAdData(null)
                toast.success("Ad data updated")
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        } finally{
            setLoading(false)
        }
    }
    const formatDate = (date) =>
        date ? new Date(date).toISOString().split("T")[0] : "";

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create a temporary image to read its dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            if (adData?.spot === "ListingPage") {
                // check required height
                if (img.height < 440) {
                    toast.error("Banner image height must be exactly 440px!");
                    return;
                }
                if (img.width < 1440) {
                    toast.error("Banner image height must be exactly 1440px!");
                    return;
                }
            }

            // If valid, save image to state
            setAdData({ ...adData, image: file });
        };
    };
    useEffect(() => {
        if(listParam=='true'){
            setAdData(null)
        }
    }, [listParam])
    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {loading?<Loader/>
            : adData ?
                <form onSubmit={handleAdSubmit} className='main-content'>
                    <div className="row mb-3">
                        <div className="col-sm-6">
                            <label htmlFor='name'>Account Name</label>
                            <input id='name' type="text"
                            disabled={adData?.status=='approve'}
                             className="form-control" value={adData?.accountName} onChange={(e) => setAdData({ ...adData, accountName: e.target.value })} />

                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Email</label>
                            <input id='name' type="text" disabled={adData?.status=='approve'} className="form-control" value={adData?.email} onChange={(e) => setAdData({ ...adData, email: e.target.value })} />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Spot</label>
                            <select name="spot" value={adData?.spot} disabled={adData?.status=='approve'} onChange={(e) => setAdData({ ...adData, spot: e.target.value })} id="" className="form-select" required>
                                <option value="">Select page</option>
                                <option value="HomePageAccredited">Home Page Accredited</option>
                                <option value="HomePage2">Home page 2</option>
                                <option value="CategoryPage">Category Page</option>
                                <option value="ListingPage">Listing Page</option>
                            </select>
                            {/* <input id='name' type="text" className="form-control" /> */}
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Contact Number</label>
                            <input id='name' disabled={adData?.status=='approve'} type="text" className="form-control" value={adData?.contactNumber} onChange={(e) => setAdData({ ...adData, contactNumber: e.target.value })} />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='name'>Submit on </label>
                            <input id='name' disabled={adData?.status=='approve'} type="text" className="form-control" value={new Date(adData?.createdAt)?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}  />
                        </div>
                        <br />
                        {adData?.spot!=='HomePageAccredited'&&<div className='col-sm-6'>
                            <label htmlFor='name'>Calendar</label>
                            <Calendar
                                tileClassName={({ date }) => {
                                    // check if date matches
                                    const isOccupied = occupiedDates.some(
                                        (d) => d.toDateString() === date.toDateString()
                                    );

                                    return isOccupied ? "occupied-date" : null;
                                }}
                            />
                        </div>}
                        {/* <div className="col-sm-6 d-flex flex-column">
                            <label htmlFor='name'>Image </label>
                            <img className='img-fluid' src={`${base_url}/${adData?.image}`} width={400} height={250} />
                            </div> */}
                        {(adData?.status !== 'declined') &&
                            <>
                                <div className="col-sm-6">
                                    <label htmlFor='name'>Ad Image</label>
                                    <input type='file' className="form-control"
                                    disabled={adData?.status=='approve'}
                                        required={!adData?.image} onChange={handleImageChange}  />
                                    {adData?.image && <img
                                        src={
                                            adData?.image instanceof File
                                                ? URL.createObjectURL(adData.image)
                                                : `${base_url}/${adData?.image}`
                                        }
                                        alt="Ad Preview"
                                        style={{ width: "220px", height: "120px", objectFit: "cover" }}
                                    />}
                                </div>

                                <div className="col-sm-6">
                                    <label htmlFor='name'>Amount</label>
                                    <input type='number' className="form-control" required name='amount' 
                                    disabled={adData?.status=='approve'}
                                    value={adData?.amount} onChange={(e) => setAdData({ ...adData, amount: e.target.value })} 
                                     />
                                </div>
                                <div className="col-sm-6 d-flex flex-column">
                                    <label htmlFor='name'>Start Date</label>
                                    <DatePicker
                                        selected={adData.startDate}
                                        onChange={date => setAdData({ ...adData, startDate: date })}
                                        minDate={new Date()} // today
                                        excludeDates={adData?.spot!=='HomePageAccredited'&&occupiedDates} // disable occupied dates
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                        disabled={adData?.status=='approve'}
                                    />
                                </div>
                                <div className="col-sm-6 d-flex flex-column">
                                    <label htmlFor='name'>End Date</label>
                                    <DatePicker
                                        selected={adData.endDate}
                                        onChange={date => setAdData({ ...adData, endDate: date })}
                                        minDate={new Date()} // today
                                        excludeDates={adData?.spot!=='HomePageAccredited'&&occupiedDates} // disable occupied dates
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                        disabled={adData?.status=='approve'}
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor='name'>Status</label>
                                    <select className='form-select' value={adData?.status} 
                                    disabled={adData?.status=='approve'}
                                    onChange={(e) => setAdData({ ...adData, status: e.target.value })} >
                                        <option value="requested">Requested</option>
                                        <option value="approve">Approved Ad</option>
                                        <option value="live">Live</option>
                                        <option value="declined">Declined</option>
                                        <option value="expired">Expired</option>

                                    </select>
                                    {/* <input id='name' type="text" className="form-control text-capitalize" value={adData?.status} onChange={(e) => setAdData({ ...adData, status: e.target.value })} /> */}
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor='name'>Description</label>
                                    <textarea rows={10} id='name' 
                                    disabled={adData?.status=='approve'}
                                    type="text" className="form-control" 
                                    value={adData?.detail} onChange={(e) => setAdData({ ...adData, description: e.target.value })} />
                                </div>
                            </>}
                    </div>
                    <div className="d-flex justify-content-between">
                        <button onClick={() => setAdData(null)} className='btn btn-secondary'>Back</button>
                         <button type='submit' className='btn btn-primary'>Submit</button>

                    </div>
                </form> : <div className='main-content'>
                    <div className='row'></div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Advertisement</h5>
                                <div className='d-flex gap-5'>
                                    {/* <select className='form-select' value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="requested">Requested</option>
                                        <option value="approve">Approved Ad</option>
                                        <option value="declined">Declined</option>
                                        <option value="expired">Expired</option>
                                        <option value="live">Live</option>


                                    </select> */}
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
                                                            <td className='text-capitalize'>{cat?.status === 'approve' ? 'Approved Ad' : cat?.status}</td>
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end gap-2">
                                                                    <button onClick={() => setAdData({ ...cat, startDate: formatDate(cat.startDate), endDate: formatDate(cat.endDate) })}
                                                                        className="btn btn-sm btn-light"><FiEye /></button>
                                                                    {/* <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(cat._id)}><FiTrash2 /></button> */}
                                                                  
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
