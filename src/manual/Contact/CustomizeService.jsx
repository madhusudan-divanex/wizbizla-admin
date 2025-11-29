import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
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

const CustomizedService = () => {
    const [serviceData, setServiceData] = useState(null)
    const [userList, setUserList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const fetchCustomers = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `requested-service?page=${pageNumber}&type=customize-service`
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
        console.log("run")
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
        serviceActivity: item.serviceActivity,
        ServiceProviders: item.preferenceToAvoid,
        type: item.type,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    }));
    async function handleAction() {
        const data = { serviceId: serviceData._id, status: serviceData.status }
        try {
            const result = await postApiData('service-action', data)
            console.log("object", result)
            if (result.success) {
                fetchCustomers()
                toast.success("Service status is updated")
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
            {serviceData ? <div className='main-content'>
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
                        <label>Service Activity</label>
                        <input type="text" className="form-control" value={serviceData?.serviceActivity || "N/A"} disabled />
                    </div>

                    <div className="col-sm-12">
                        <label>Service Providers’ Name</label>
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
                            value={new Date(serviceData?.createdAt)?.toLocaleDateString()}
                            disabled
                        />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor='name'>Status</label>
                        <select id='name' name='status' type="text" className="form-select" value={serviceData.status} onChange={(e) => setServiceData({ ...serviceData, status: e.target.value })}>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            {/* <option value="cancel">Cancel</option> */}
                        </select>
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
                                <h5 className="mb-0">Customize Service</h5>
                                <div className='d-flex gap-5'>
                                    {/* <input type='search' placeholder='search here...' value={search}
                                    onChange={handleSearchChange} /> */}
                                    <CSVLink
                                        data={formattedData}
                                        // headers={headers}
                                        filename={"customize.csv"}
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
                                            <th scope="col " className='text-center'>Action</th>
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
                                                        <td>{new Date(cat?.createdAt)?.toLocaleDateString()}</td>
                                                        <td className='d-flex justify-content-center gap-3'>
                                                            <button onClick={() => setServiceData(cat)} className="btn btn-sm btn-light"><FiEye /></button>
                                                            <Link
                                                                to={
                                                                    cat?.userId?.role === 'provider'
                                                                        ? `/user/detail/${cat.userId._id}`
                                                                        : `/consumer/detail/${cat.userId._id}`
                                                                }
                                                                className="btn btn-success col-4 text-white"
                                                            >
                                                                View User
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

export default CustomizedService;
