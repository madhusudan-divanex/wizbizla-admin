import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Pagination from '@/components/Services/Pagination';
import { getApiData, getSecureApiData } from '../Services/api';
import base_url from '../baseUrl';
import Footer from '@/components/shared/Footer';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import { CSVLink } from 'react-csv';

const NewsLetter = () => {
    const [userList, setUserList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchData = async (pageNumber = page) => {
        try {
            const result = await getSecureApiData(
                `newsletter?page=${pageNumber}`
            );

            if (result.success) {
                setUserList(result.data || []);
                setTotal(result.totalPages);
            }
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };


    useEffect(() => {
        fetchData();


    }, [page]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== page) {
            setPage(pageNumber);
        }
    };

    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            <div className='main-content'>
                <div className='row'></div>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Get In touch</h5>
                            <div className='d-flex gap-5'>
                                {/* <input type='search' placeholder='search here...' value={search}
                                    onChange={handleSearchChange} /> */}
                                <CSVLink
                                    data={userList}
                                    // headers={headers}
                                    filename={"newsletter.csv"}
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
                                        <th scope="col">Subscribed At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userList?.length > 0 ? (
                                            userList?.map((cat, index) => {
                                                return (
                                                    <tr key={cat._id}>
                                                        <td>{(page - 1) * 10 + index + 1}</td>
                                                        <td>{cat?.email}</td>
                                                        <td>{new Date(cat?.createdAt)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })}</td>

                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className='text-center'>No query Found</td>
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
            <Footer />
        </>
    );
};

export default NewsLetter;
