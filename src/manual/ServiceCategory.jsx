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

function ServiceCategory() {
    const [isSub, setIsSub] = useState(false)
    const [name,setName]=useState('')
    const [isEdit,setIsEdit]=useState(null)
    const [subCategoryList, setServiceCategoryList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const fetchServiceCategory = async (pageNumber = page || 1, searchQuery = search) => {
        try {
            const result = await getSecureApiData(`service-category?page=${pageNumber}`)
            if (result.status) {
                setServiceCategoryList(result.categoryData)
                setPage(result.currentPage);
                setPages(result.totalPages);
                setTotal(result.totalServiceCategory);
            } else {
                toast.error(result.message)
            }
            // const res = await axios.get(`https://api.wizbizlaonboard.com/api/categorys/all?page=${pageNumber}&q=${searchQuery}`);
            // if (res.data.success) {
            //     setServiceCategoryList(res.data.categorys || []);
            //     setPage(res.data.currentPage);
            //     setPages(res.data.totalPages);
            //     setTotal(res.data.totalCategorys);
            // }
        } catch (error) {
            console.log("error fetch categorys", error);
        }
    }

    useEffect(() => {
        fetchServiceCategory();
    }, [page, search]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== page) {
            setPage(pageNumber);
        }
    };
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit) {
            const data={name,subCatId:isEdit}
            try {
                const result = await updateApiData('service-category', data)
                if (result.status) {
                    toast.success("Category updated successfully");
                    setIsEdit(false)
                    fetchServiceCategory()
                    setIsSub(false)
                } else {
                    toast.error(result.message || "adding failed");
                }
            } catch (error) {
                console.log("error handle Submit data", error);
                toast.error(error.response?.data?.message || "Server error");
            }
        } else {
            try {
                const result = await postApiData('service-category', {name})
                if (result.status) {
                    toast.success("Service Category created successfully");
                   setIsEdit(false)
                   fetchServiceCategory()
                    setIsSub(false)
                } else {
                    toast.error(result.message || "adding failed");
                }
            } catch (error) {
                console.log("error handle Submit data", error);
                toast.error(error.response?.data?.message || "Server error");
            }
        }
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
                    const result = await deleteApiData(`service-category/${id}`)
                    if (result.status) {
                        toast.success(result.message);
                        fetchServiceCategory();
                    }
                } catch (error) {
                    console.log("error delete categorys", error)
                }
            }
        });
    }
    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {isSub ?
                <div className='main-content'>
                    <div className='row'>
                        <div className="container mt-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Service Category Data</h5>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <label htmlFor='name' className="col-sm-2 col-form-label">Name</label>
                                                <input type="text" className="form-control" placeholder="Name" required name='name' value={name} onChange={(e)=>setName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="text-end d-flex justify-content-between">
                                            <button onClick={()=>setIsSub(false)}  className="btn btn-secondary">Back</button>
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
                                    <h5 className="mb-0">Service Categories</h5>
                                    <div>
                                        {/* <input type='search' placeholder='search here...' value={search}
                                        onChange={handleSearchChange} /> */}
                                        <button onClick={() => {setName('')
                                            setIsSub(true)}} className='btn btn-primary'>Create</button>
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
                                                subCategoryList?.length > 0 ? (
                                                    subCategoryList?.map((item, index) => {
                                                        return (
                                                            <tr key={item._id}>
                                                                <td>{(page - 1) * 10 + index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>{new Date(item?.updatedAt)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })}</td>
                                                                <td >
                                                                    <div className="d-flex justify-content-start gap-2">
                                                                        <button onClick={()=>{
                                                                            setIsEdit(item._id)
                                                                            setName(item?.name)
                                                                            setIsSub(true)}}  className="btn btn-sm btn-light"><FiEye /></button>
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

export default ServiceCategory
