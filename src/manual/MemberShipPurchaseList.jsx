import CustomersTable from '@/components/customers/CustomersTable'
import Footer from '@/components/shared/Footer'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Pagination from '@/components/Services/Pagination';
import { deleteApiData, getSecureApiData } from '../Services/api';


function MemberShipPurchaseList() {
    const [purchaseList, setPurchaseList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const fetchPurchaseData = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `get-all-purchase-membership?page=${pageNumber}&search=${encodeURIComponent(searchQuery)}`
            );

            if (result.status) {
                setPurchaseList(result.purchaseData || []);
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalPurchase);
            }
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchPurchaseData();
    }, [page, search]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== page) {
            setPage(pageNumber);
        }
    };
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const handleDelete = (id) => {
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
                    const result = await deleteApiData(`delete-membership/${id}`)
                    if (result.status) {
                        toast.success(result.message);
                        fetchMembership();
                    }
                } catch (error) {
                    console.log("error delete memberships", error)
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
                <div className='row'>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Membership Purchase Data</h5>
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
                                            <th scope="col">Name</th>
                                            <th scope="col">MemberShip</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Start Date</th>
                                            <th scope="col">End Date</th>
                                            {/* <th scope="col" >Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            purchaseList?.length > 0 ? (
                                                purchaseList?.map((item, index) => {
                                                    return (
                                                        <tr key={item._id}>
                                                            <td>{(page - 1) * 10 + index + 1}</td>
                                                            <td>{item?.userId?.firstName}</td>
                                                            <td>{item?.membershipId?.name}</td>
                                                            {/* <td>{item?.price?.yearly}</td> */}
                                                            <td>{item?.membershipId?.type}</td>
                                                            <td>{new Date(item?.startDate)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })}</td>
                                                            <td>{new Date(item?.endDate)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })}</td>
                                                            {/* <td >
                                                                <div className="d-flex justify-content-start gap-2">
                                                                    <Link to={`/membership/view/${item._id}`} className="btn btn-sm btn-light"><FiEye /></Link>
                                                                    <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(item._id)}><FiTrash2 /></button>
                                                                </div>
                                                            </td> */}
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>No memberships Found</td>
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
            </div>
            <Footer />
        </>
    )
}

export default MemberShipPurchaseList
