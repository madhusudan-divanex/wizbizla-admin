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

const Chat = () => {
    const [userList, setUserList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const fetchCustomers = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(
                `get-chats?page=${pageNumber}`
            );

            if (result.status) {
                setUserList(result.data || []);
                setPage(result.page);
                setTotal(result.total);
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
                            <h5 className="mb-0">Users Chat</h5>
                            <div className='d-flex gap-5'>
                                {/* <input type='search' placeholder='search here...' value={search}
                                    onChange={handleSearchChange} /> */}
                                
                            </div>
                        </div>
                        <div className="card-body table-responsive">
                            <table className="table table-hover table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">S.No.</th>
                                        <th scope="col">User 1</th>
                                        <th scope="col">User 2</th>
                                        <th scope="col">Last Message</th>
                                        <th scope="col">Crated At</th>
                                        <th scope="col">View</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userList?.length > 0 ? (
                                            userList?.map((cat, index) => {
                                                return (
                                                    <tr key={cat._id}>
                                                        <td>{(page - 1) * 10 + index + 1}</td>
                                                        <td><img className='me-2 rounded-5' width={50} height={50} src={`${base_url}/${cat?.users?.profile1?.profileImage}`}/>
                                                            {cat?.users?.user1?.firstName +' ' + cat?.users?.user1?.lastName}</td>
                                                        <td><img className='me-2 rounded-5'  width={50} height={50} src={`${base_url}/${cat?.users?.profile2?.profileImage}`}/>
                                                            {cat?.users?.user2?.firstName +' ' + cat?.users?.user2?.lastName}</td>
                                                        <td>{cat?.lastMessage?.startsWith('uploads') ?
                                                        <img  width={50} height={50} src={`${base_url}/${cat?.lastMessage}`}/>
                                                        :cat?.lastMessage}</td>
                                                        <td>{new Date(cat?.createdAt)?.toLocaleString()}</td>
                                                        <td><Link to={`/chat-data?from=${cat?.users?.user1?._id}&to=${cat?.users?.user2?._id}`} className="btn btn-sm btn-success"><FiEye /></Link></td>
                                                        
                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className='text-center'>No chat Found</td>
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

export default Chat;
