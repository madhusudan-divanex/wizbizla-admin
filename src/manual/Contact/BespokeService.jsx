import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2, FiUser } from 'react-icons/fi';
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
import Loader from '../../layout/Loader';
import { Select, Spin } from "antd";

const BespokeService = () => {
    const [serviceData, setServiceData] = useState(null)
    const [userList, setUserList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false)
    const [matchProfile, setMatchProfile] = useState([])

    const fetchCustomers = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `requested-service?page=${pageNumber}&type=concierge-service`
            );

            if (result.status) {
                setUserList(result.requestedData || []);
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalQuery);
            }
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            fetchCustomers();
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
    const formattedData = userList.map(item => ({
        id: item._id,
        userId: item.userId?._id || item.userId || "",  // <-- extract the field you want
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        contactNumber: item.contactNumber,
        businessName: item.businessName,
        businessCategory: item.businessCategory,
        serviceActivity: item.serviceActivity,
        priceRange: item.priceRange,
        serviceDate: item.serviceDate,
        specificRequirement: item.specificRequirement,
        preferenceToAvoid: item.preferenceToAvoid,
        type: item.type,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    }));
    async function handleAction() {
        setLoading(true)
        const data = { serviceId: serviceData._id, status: serviceData.status, providerId: serviceData.providerId }
        try {
            const result = await postApiData('service-action', data)
            if (result.success) {
                fetchCustomers()
                toast.success("Service status is updated")
            } else {
                toast.error(result.message)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    const fetchUserProfile = async (searchText) => {
        if (searchText.length < 2) {
            setMatchProfile([]);
            return;
        }
        try {
            // setLoading(true);
            const result = await getApiData(`api/users/search-profile/${searchText}?role=provider`);
            if (result.success) {
                setMatchProfile(result.profileUsers);
            } else {
                setMatchProfile([]);
            }
        } catch (error) {
            console.error(error);
            setMatchProfile([]);
        } finally {
            // setLoading(false);
        }
    };
    const setConnectionValues = (values) => {
        setServiceData((prevData) => ({
            ...prevData,
            providerId: values,
        }));
    };


    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {loading ? <Loader /> : serviceData ? <div className='main-content'>
                <div className="row mb-3">

                    <div className="col-sm-6">
                        <label>First Name</label>
                        <input type="text" className="form-control" value={serviceData?.firstName} disabled />
                    </div>

                    <div className="col-sm-6">
                        <label>Last Name</label>
                        <input type="text" className="form-control" value={serviceData?.lastName} disabled />
                    </div>

                    <div className="col-sm-6">
                        <label>Email</label>
                        <input type="text" className="form-control" value={serviceData?.email} disabled />
                    </div>

                    <div className="col-sm-6">
                        <label>Contact Number</label>
                        <input type="text" className="form-control" value={serviceData?.contactNumber} disabled />
                    </div>

                    <div className="col-sm-6">
                        <label>Business Name</label>
                        <input type="text" className="form-control" value={serviceData?.businessName || "N/A"} disabled />
                    </div>

                    <div className="col-sm-6">
                        <label>Business Category</label>
                        <input type="text" className="form-control" value={serviceData?.businessCategory?.name || "N/A"} disabled />
                    </div>

                    <div className="col-sm-6">
                        <label>Service Activity</label>
                        <input type="text" className="form-control" value={serviceData?.serviceActivity || "N/A"} disabled />
                    </div>

                    <div className="col-sm-6">
                        <label>Price Range</label>
                        <input type="text" className="form-control" value={serviceData?.priceRange?.minPrice + '-' + serviceData?.priceRange?.maxPrice ?? "N/A"} disabled />
                    </div>

                    <div className="col-sm-6">
                        <label>Service Date</label>
                        <input
                            type="text"
                            className="form-control"
                            value={serviceData?.serviceDate ? new Date(serviceData?.serviceDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A"}
                            disabled
                        />
                    </div>

                    <div className="col-sm-12">
                        <label>Specific Requirement</label>
                        <textarea
                            rows={4}
                            className="form-control"
                            value={serviceData?.specificRequirement || "N/A"}
                            disabled
                        />
                    </div>

                    <div className="col-sm-12">
                        <label>Preferences to Avoid</label>
                        <textarea
                            rows={4}
                            className="form-control"
                            value={serviceData?.preferenceToAvoid || "N/A"}
                            disabled
                        />
                    </div>

                    <div className="col-sm-6">
                        <label>Created At</label>
                        <input
                            type="text"
                            className="form-control"
                            value={new Date(serviceData?.createdAt)?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            disabled
                        />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Status</label>
                        <select id='name' name='status' type="text" className="form-select" value={serviceData.status} onChange={(e) => setServiceData({ ...serviceData, status: e.target.value })}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approve</option>
                            <option value="reject">Reject</option>
                            <option value="completed">Completed</option>
                            {/* <option value="cancel">Cancel</option> */}
                        </select>
                    </div>
                    <div className='col-sm-6'>
                        <label htmlFor='providerId'>Service Provider</label>
                        <Select
                            showSearch
                            allowClear
                            className="w-100 multi-service-select"
                            placeholder="Search and select user"
                            value={serviceData?.providerId}   // ✅ IDs here
                            onChange={setConnectionValues}
                            filterOption={false}
                            onSearch={fetchUserProfile}
                            // notFoundContent={loading ? <Spin size="small" /> : "No users found"}
                            options={matchProfile.map((user) => ({
                                label: `${user.firstName} ${user?.lastName}`, // ✅ display name
                                value: user._id, // ✅ backend receives ID
                            }))}
                        />
                    </div>

                </div>

                <div className="col-12 d-flex justify-content-between">
                    <button onClick={() => setServiceData(null)} className='btn btn-secondary'>Back</button>
                    <button onClick={() => handleAction()} className='btn btn-primary'>Update</button>

                </div>
            </div>
                : <div className='main-content'>
                    <div className='row'></div>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Bespoke Service</h5>
                                <div className='d-flex gap-5'>
                                    {/* <input type='search' placeholder='search here...' value={search}
                                    onChange={handleSearchChange} /> */}
                                    <CSVLink
                                        data={formattedData}
                                        // headers={headers}
                                        filename={"bespoke.csv"}
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
                                            <th scope="col">Full Name</th>
                                            <th scope="col">Contact Number</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            userList?.length > 0 ? (
                                                userList?.map((cat, index) => (
                                                    <tr key={cat._id}>
                                                        <td>{(page - 1) * 10 + index + 1}</td>
                                                        <td>{cat?.firstName} {cat?.lastName}</td>
                                                        <td>{cat?.contactNumber}</td>
                                                        <td>{cat?.email}</td>
                                                        <td>{cat?.status}</td>
                                                        <td>{new Date(cat?.createdAt)?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>

                                                        <td className='d-flex justify-content-between'>
                                                            <button onClick={() => {
                                                                if (cat?.providerId) {
                                                                    setMatchProfile([cat?.providerId])
                                                                }
                                                                setServiceData({...cat,providerId:cat?.providerId && cat?.providerId})
                                                            }} className="btn btn-sm btn-light"><FiEye /></button>
                                                            <Link
                                                                to={
                                                                    cat?.userId?.role === 'provider'
                                                                        ? `/user/detail/${cat.userId._id}`
                                                                        : `/consumer/detail/${cat.userId._id}`
                                                                }
                                                                className="btn btn-success col-4 text-white"
                                                            >
                                                                <FiUser />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className='text-center'>No requests found</td>
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

export default BespokeService;
