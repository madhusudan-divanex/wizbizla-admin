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
import { deleteApiData, getSecureApiData, postApiData, updateApiData } from '../Services/api';
import base_url from '../baseUrl';

function BlogCategory() {
    const [categoryList, setCategoryList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [isEdit, setIsEdit] = useState(null)
    const [isCreate, setIsCreate] = useState(null)
    const [values, setValues] = useState({ name: "" })

    const fetchCategory = async (pageNumber = page, searchQuery = search) => {
        try {
            const result = await getSecureApiData(`cms/blog-category?page=${page}&limit=10`)
            if (result.status) {
                setCategoryList(result.categoryData)
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalCategory);
            } else {
                toast.error(result.message)
            }

        } catch (error) {
            console.log("error fetch categorys", error);
        }
    }

    useEffect(() => {
        fetchCategory();
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
                    const result = await deleteApiData(`cms/blog-category/${id}`)
                    if (result.status) {
                        toast.success(result.message);
                        fetchCategory();
                    }else{
                        toast.error(result.message)
                    }
                } catch (error) {
                    console.log("error delete categorys", error)
                }
            }
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { name: values.name };
        try {
            const result = isEdit
                ? await updateApiData('cms/blog-category', payload)
                : await postApiData('cms/blog-category', payload);

            if (result.status) {
                fetchCategory()
                toast.success(isEdit ? "Category updated successfully" : "Category created successfully");
                if (isEdit) setIsEdit(null);
                else setIsCreate(false);
            } else {
                toast.error(result.message || "Adding failed");
            }
        } catch (error) {
            console.log("Error handleSubmit data", error);
            toast.error(error.response?.data?.message || "Server error");
        }
    };

    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {(isEdit || isCreate) ?
                <div className='main-content'>
                    <div className='row'>
                        <div className="container mt-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Category Data</h5>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <label htmlFor='name' className="col-sm-2 col-form-label">Name</label>
                                                <input type="text" className="form-control" placeholder="Name" required name='name' value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
                                            </div>

                                        </div>
                                        <div className="text-end d-flex justify-content-between">
                                            <button onClick={() => setIsEdit(null)} className="btn btn-secondary">Back</button>
                                            <button type='submit' className="btn btn-primary">Save</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div className='main-content'>
                    <div className='row'>
                        <div className="container-fluid">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Blog Categories</h5>
                                    <div>
                                        {/* <input type='search' placeholder='search here...' value={search}
                                        onChange={handleSearchChange} /> */}
                                        <button onClick={() => setIsCreate(true)} className='btn btn-primary'>Create</button>
                                    </div>
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col"> S.No. </th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Last Update</th>
                                                <th scope="col" >Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                categoryList?.length > 0 ? (
                                                    categoryList?.map((item, index) => {
                                                        return (
                                                            <tr key={item._id}>
                                                                <td>{(page - 1) * 10 + index + 1}</td>
                                                                <td>{item.name}</td>

                                                                <td>{new Date(item?.updatedAt)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })}</td>
                                                                <td >
                                                                    <div className="d-flex justify-content-start gap-2">
                                                                        <button onClick={() => setValues(item)} className="btn btn-sm btn-light"><FiEye /></button>
                                                                        <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(item._id)}><FiTrash2 /></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className='text-center'>No Cateogry Found</td>
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
                </div>}
            <Footer />
        </>
    )
}

export default BlogCategory
