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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Faq() {
    const [faqList, setFaqList] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [faqData, setFaqData] = useState(null);
    const [faqForm, setFaqForm] = useState({
        question: "",
        answer: "",
        category: ""
    })

    const fetchFaq = async () => {
        try {
            const result = await getSecureApiData(`cms/faq`)
            if (result.success) {
                setFaqList(result.data)
            } else {
                toast.error(result.message)
            }
            // const res = await axios.get(`https://api.wizbizlaonboard.com/api/categorys/all?page=${pageNumber}&q=${searchQuery}`);
            // if (res.data.success) {
            //     setFaqList(res.data.categorys || []);
            //     setPage(res.data.currentPage);
            //     setPages(res.data.totalPages);
            //     setTotal(res.data.totalCategorys);
            // }
        } catch (error) {
            console.log("error fetch categorys", error);
        }
    }

    useEffect(() => {
        fetchFaq();
    }, []);

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
                    const result = await deleteApiData(`cms/faq/${id}`)
                    if (result.success) {
                        toast.success(result.message);
                        fetchCategory();
                    }
                } catch (error) {
                    console.log("error delete categorys", error)
                }
            }
        });
    }
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const response = faqForm._id ? await updateApiData('cms/faq', faqForm) : await postApiData('cms/faq', faqForm)
       
            if (response.success) {
                setFaqData(null);
                fetchFaq();
                setFaqForm({
                    question: "",
                    answer: "",
                    category: "",
                });
                toast.success("Data updated successfully")
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFaqForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    return (
        <>
            <PageHeader>
                {/* <CustomersHeader /> */}
            </PageHeader>
            {faqData ?
                <form onSubmit={handleSubmit} className='main-content'>
                    <div className="row mb-3">

                        <div className="col-sm-6">
                            <label>Question</label>
                            <input
                                type="text"
                                className="form-control"
                                name="question"
                                value={faqForm.question}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-sm-6">
                            <label>Category</label>
                            <select className='form-select'  name="category"
                                value={faqForm.category}
                                onChange={handleChange}>
                                <option value="">Select Category</option>
                                <option value="General">General</option>
                                <option value="Account">Account</option>
                                <option value="Billing">Billing</option>
                                <option value="Help">Help</option>
                                <option value="Technical">Technical</option>
                            </select>
                        </div>

                        <div className="col-sm-12">
                            <label>Answer</label>
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    // toolbar: [
                                    //     'heading', '|',
                                    //     'bold', 'italic', 'underline', '|',
                                    //     'bulletedList', 'numberedList', '|',
                                    //     'link', 'imageUpload', '|',
                                    //     'undo', 'redo','CodeBlock'
                                    // ],
                                    ckfinder: {
                                        uploadUrl: `${base_url}/upload/image`,
                                    },
                                    // removePlugins: [
                                    //     'MediaEmbed', 'Table', 'TableToolbar', 'CodeBlock', 'EasyImage', 'ImageInsert'
                                    // ],
                                    image: {
                                        toolbar: [
                                            'imageTextAlternative', '|',
                                            'imageStyle:full',
                                            'imageStyle:side'
                                        ]
                                    }
                                }}
                                data={faqForm.answer}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFaqForm({ ...faqForm, answer: data });
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-12 d-flex justify-content-between gap-2">
                        <button type='submit' className='btn btn-secondary' onClick={() => setFaqData(null)}>Back</button>

                        <button type='submit' className='btn btn-primary'>Submit</button>
                    </div>
                </form> : <div className='main-content'>
                    <div className='row'>
                        <div className="container-fluid">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Faqs</h5>
                                    <div>
                                        {/* <input type='search' placeholder='search here...' value={search}
                                        onChange={handleSearchChange} /> */}
                                        <button onClick={() => {setFaqForm({question: "", answer: "", category: ""});
                                            setFaqData(true)}} className='btn btn-primary'>Create</button>
                                    </div>
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col"> S.No. </th>
                                                <th scope="col">Question</th>
                                                <th scope="col"> Category</th>
                                                <th scope="col">Last Update</th>
                                                <th scope="col" >Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                faqList?.length > 0 ? (
                                                    faqList?.map((item, index) => {
                                                        return (
                                                            <tr key={item._id}>
                                                                <td>{(page - 1) * 10 + index + 1}</td>
                                                                <td>{item?.question}</td>
                                                                <td>{item?.category}
                                                                </td>
                                                                <td>{new Date(item?.updatedAt)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })}</td>
                                                                <td >
                                                                    <div className="d-flex justify-content-start gap-2">
                                                                        <button onClick={() => {
                                                                            setFaqData(item);
                                                                            setFaqForm(item)
                                                                        }} className="btn btn-sm btn-light"><FiEye /></button>
                                                                        <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(item._id)}><FiTrash2 /></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className='text-center'>No Faq Found</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    {/* <div className="d-flex justify-content-between align-items-center p-2">
                                        <div className="text-muted">
                                            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} entries
                                        </div>
                                        <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            <Footer />
        </>
    )
}

export default Faq
