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

const Advertisement = () => {
    const [adList, setAdList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [adData,setAdData]=useState(null)

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


    useEffect(() => {
        setTimeout(() => {
            fetchAds();
        }, 500)

    }, [page, search]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== page) {
            setPage(pageNumber);
        }
    };
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    
    async function handleAction(id,status) {
            const data={adId:id,status}
            try {
                const result=await postApiData('ad-action',data)
                if(result.success){
                    fetchAds()
                    toast.success("Ad status is updated")
                }else{
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
            {adData?
            <div className='main-content'><div className="row mb-3">
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
                    <input id='name' type="text" className="form-control" value={new Date(adData?.createdAt)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })} disabled />
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
                    <img className='img-fluid' src={`${base_url}/${adData?.image}`} width={400} height={250}/>
                </div>
            </div>
                <div className="col-2 pb-5">
                <button onClick={() => setAdData(null)} className='btn btn-secondary'>Back</button>
            </div>
            </div>:<div className='main-content'>
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
                                                                <button onClick={()=>setAdData(cat)} className="btn btn-sm btn-light"><FiEye /></button>
                                                                {/* <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(cat._id)}><FiTrash2 /></button> */}
                                                                <button title='Approve' className="btn btn-success btn-sm btn-light text-white" onClick={() => handleAction(cat._id,'live')}><FiCheckCircle size={10}/></button>
                                                                <button title='Declined' className="btn btn-danger btn-sm btn-light text-white" onClick={() => handleAction(cat._id,'declined')}><FiXCircle /></button>
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
