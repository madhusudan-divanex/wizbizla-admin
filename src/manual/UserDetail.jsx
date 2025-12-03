import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSecureApiData, postApiData } from '../Services/api';
import base_url from '../baseUrl';
import { FaEye } from 'react-icons/fa6';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const [bannerPath,setBannerPath]=useState()
    const [nextPay,setNextPay]=useState()
    const [membershipData, setMembershipData] = useState()
    const [status, setStatus] = useState('pending')
    const [values, setValues] = useState({
        name: '',
        title: '',
        company: '',
        location: '',
        avatar: '',
        idealClientProfile: '',
        bannerImage: null,
        profileImage: null,
        videoIntro: null,
        categories: []
    })
    const [profileData, setProfileData] = useState({
        name: '',
        type: '',
        title: '',
        company: '',
        location: '',
        avatar: '',
        idealClientProfile: '',
        bannerImage: null,
        profileImage: null,
        videoIntro: null,
        categories: []
    })
    const [values1, setValues1] = useState({
        experience: '',
        expertise: '',
        videoIntro: null,
        thoughtLeadershipPortfolio: [],
        additionalSections: []
    })
    const [values2, setValues2] = useState({
        licenseUsedBy: '',
        licenses: [],
        hasCertificate: "",
        additionalCertificates: [],
        professionalServices: []
    })

    const [values3, setValues3] = useState({
        // references: [],
        // referenceProgram: false,
        // recommendations: false
    })

    const fetchUsersData = async () => {
        try {
            const result = await getSecureApiData(`api/users/${id}`)
            if (result.success) {
                setValues(result.user || {})
                setStatus(result.user.status)
                setMembershipData(result.membershipData || {})
            }
        } catch (error) {
            console.log("error fetching profile data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };
    const downloadImage = async (path) => {
        try {
            const response = await fetch(`${base_url}/${path}`, { mode: 'cors' });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = values.bannerImage; // or specify a filename
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed', error);
        }
    };
    async function getNextPay() {
        try {
            const result = await getSecureApiData(`api/users/next-pay/${id}`)
            if (result.success) {
                setNextPay(result.data)
            } else {
            }
        } catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        fetchUsersLicenceData()
        fetchUsersData();
        fetchUsersProfileData()
        fetchUsersMarketingData()
        fetchUsersReferenceData()
        getNextPay()

    }, [id])
    const renderImage = (path) => {
        if (!path) return null;
        const src = `${base_url}${path.replace(/\\/g, '/')}`;
        return <img src={src} alt="img" className="img-fluid rounded mb-2" style={{ maxWidth: '200px' }} crossOrigin='anonymous' />;
    };
    const renderBannerImage = (path) => {
        if (!path) return null;
        const src = `${base_url}/${path.replace(/\\/g, '/')}`;
        return <img src={src} alt="img" className="img-fluid rounded mb-2" style={{ maxWidth: '200px' }} crossOrigin='anonymous' />;
    };

    const renderVideo = (path) => {
        if (!path) return null;
        const src = `${base_url}${path.replace(/\\/g, '/')}`;
        return (
            <video width="320" height="240" controls className="mb-2" crossOrigin='anonymous'>
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
                <track />
            </video>
        );
    };

    const fetchUsersMarketingData = async () => {
        try {
            const res = await getSecureApiData(`api/provider/get-marketing/${id}`);
            if (res.status) {
                setValues1(res.data || {})
            }
        } catch (error) {
            console.log("error fetching marketing data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    const fetchUsersLicenceData = async () => {
        try {
            const res = await getSecureApiData(`api/provider/get-accreditation/${id}`);
            if (res.status) {
                setValues2(res.data || {})
            } else {
                setValues2({})
            }
        } catch (error) {
            console.log("error fetching license data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    const fetchUsersReferenceData = async () => {
        try {
            const res = await getSecureApiData(`api/provider/get-feature/${id}`);
            if (res.status) {
                setValues3(res.data || {})
            }
        } catch (error) {
            console.log("error fetching references data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };
    const fetchUsersProfileData = async () => {
        try {
            const res = await getSecureApiData(`api/provider/profile-get/${id}`);
            if (res.status) {
                setProfileData(res.data || {})
            }
        } catch (error) {
            console.log("error fetching references data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };
    const userActionProfile = async () => {
        const data = { userId: id, status,isAdmin:true }
        try {
            const result = await postApiData(`profile-action`, data)
            if (result.success) {
                toast.success('User status will updated!')
                fetchUsersData()
            }
        } catch (error) {
            console.log("error fetching profile data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };
      useEffect(() => {
        if (Object.keys(profileData).length > 0) {
            const bPath = profileData?.isDefaultBanner ? profileData?.categories[0]?.category?.image : profileData?.bannerImage?.replace(/\\/g, '/'); // fix Windows backslashes
            setBannerPath(bPath)
        }
    }, [profileData])

    const bannerUrl = bannerPath?.startsWith('/')
        ? `${bannerPath}`
        : `/${bannerPath}`;
    return (
        <div className="container mt-4">
            <div className="card">
                <div className="patient-bio-tab">
                    <ul className="nav nav-tabs gap-3" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link active"
                                id="home-tab"
                                data-bs-toggle="tab"
                                href="#userData"
                                role="tab"
                            >
                                User Data
                            </a>
                        </li>

                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link "
                                id="home-tab"
                                data-bs-toggle="tab"
                                href="#profile"
                                role="tab"
                            >
                                Profile Details
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link"
                                id="profile-tab"
                                data-bs-toggle="tab"
                                href="#marketing"
                                role="tab"
                            >
                                Your Marketing
                            </a>
                        </li>

                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link"
                                id="profile-tab"
                                data-bs-toggle="tab"
                                href="#trade"
                                role="tab"
                            >
                                Registration and Certificates Details
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link"
                                id="profile-tab"
                                data-bs-toggle="tab"
                                href="#references"
                                role="tab"
                            >
                                Features
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link "
                                id="home-tab"
                                data-bs-toggle="tab"
                                href="#membership"
                                role="tab"
                            >
                                Membership
                            </a>
                        </li>
                    </ul>

                    <div className='card-body'>
                        <div className="tab-content  mt-4" id="myTabContent">
                            <div
                                className="tab-pane fade show active"
                                id="userData"
                                role="tabpanel"
                            >
                                <div className="row mb-3">
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>First Name</label>
                                        <input id='name' type="text" className="form-control" value={values?.firstName} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Last Name</label>
                                        <input id='name' type="text" className="form-control" value={values?.lastName} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Email</label>
                                        <input id='name' type="text" className="form-control" value={values?.email} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Contact Number</label>
                                        <input id='name' type="text" className="form-control" value={values?.contactNumber} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Account Create on </label>
                                        <input id='name' type="text" className="form-control" value={new Date(values?.createdAt)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Role</label>
                                        <input id='name' type="text" className="form-control" value={values?.role} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Status</label>
                                        <input id='name' type="text" className="form-control text-capitalize" value={values?.status} disabled />
                                    </div>
                                    {Object.keys(values3)?.length>0 && values.role=='provider' && <div className="col-sm-6">
                                        <label htmlFor='name'>Update Status To</label>
                                        <select id='name' name='status' type="text" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="pending">Pending</option>
                                            <option value="live">Live</option>
                                            {/* <option value="block">Block</option> */}

                                        </select>
                                        <button type="button" className='btn btn-sm btn-success mt-2' onClick={() => userActionProfile()}>Update</button>
                                    </div>}
                                </div>
                            </div>
                            <div
                                className="tab-pane fade show "
                                id="membership"
                                role="tabpanel"
                            >
                                <div className="row mb-3">
                                    {Object.keys(membershipData || {}).length > 0 ? <div className="row mb-3">
                                        <div className="col-sm-6">
                                            <label htmlFor='name'>Profile Type</label>
                                            <input id='name' type="text" className="form-control" value={membershipData?.membershipId?.name} disabled />
                                        </div>                                       
                                        <div className="col-sm-6">
                                            <label htmlFor='title'>Start Date</label>
                                            <input id='title' type="text" className="form-control" value={new Date(membershipData?.startDate)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='email'>End Date</label>
                                            <input type="text" className="form-control" value={new Date(membershipData?.endDate)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='email'>Due Date</label>
                                            <input type="text" className="form-control" value={new Date(nextPay?.nextPaymentDate)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='title'>Account Created on</label>
                                            <input id='title' type="text" className="form-control" value={new Date(values?.createdAt)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='title'>Account Approved on</label>
                                            <input id='title' type="text" className="form-control" value={new Date(values?.approvedOn)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='email'>Account Published on</label>
                                            <input type="text" className="form-control" value={new Date(values?.publishedOn)?.toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    })} disabled />
                                        </div>                                        
                                    </div> : 'No Data available'}
                                </div>
                            </div>
                            <div
                                className="tab-pane fade show "
                                id="profile"
                                role="tabpanel"
                            >
                                <div className="row mb-3">
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Type</label>
                                        <input id='name' type="text" className="form-control text-capitalize" value={profileData?.type} disabled />
                                    </div>
                                    {profileData?.type == 'individual' &&
                                        <> <div className="col-sm-6">
                                            <label htmlFor='name'>Name</label>
                                            <input id='name' type="text" className="form-control" value={profileData?.name} disabled />
                                        </div>
                                            <div className="col-sm-6">
                                                <label htmlFor='title'>Title</label>
                                                <input id='title' type="text" className="form-control" value={profileData?.title} disabled />
                                            </div>
                                        </>}
                                    <div className="col-sm-6">
                                        <label htmlFor='company'>Company / Organization</label>
                                        <input type="text" className="form-control" value={profileData?.company} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='location'>Head Office Location</label>
                                        <input type="text" className="form-control" value={profileData?.location} disabled />
                                    </div>
                                    <div className="col-sm-12">
                                        <label htmlFor='avatar'>Avatar</label>
                                        <textarea className="form-control" value={profileData?.avatar} disabled />
                                    </div>
                                    <div className="col-sm-12">
                                        <label htmlFor='clientprofile'>Ideal Client Profile</label>
                                        <textarea className="form-control" value={profileData?.idealClientProfile} disabled />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor='banner'>Banner Image</label>
                                    <div>{renderBannerImage(bannerUrl)}</div>
                                    {/* <a
                                        className="btn btn-primary w-25"
                                        target='_blank'
                                        href={`${base_url}/${values.bannerImage}`}
                                        download
                                    >
                                        Download
                                    </a> */}
                                    {!profileData?.isDefaultBanner && profileData?.bannerImage && <button className="btn btn-primary w-25" onClick={() => downloadImage(profileData.bannerImage)}>
                                        Download
                                    </button>}


                                </div>

                                <div className="mb-3">
                                    <label htmlFor='profileimage'>Profile Image</label>
                                    <div>{renderBannerImage(profileData.profileImage)}</div>
                                    {profileData?.profileImage && <button className="btn btn-primary w-25" onClick={() => downloadImage(profileData.profileImage)}>
                                        Download
                                    </button>}

                                </div>

                                <div className="mb-3">
                                    <label htmlFor='categories'>My Categories & Services</label>
                                    <ul className="list-group">
                                        {profileData?.categories?.map((cat, index) => (
                                            <li key={cat._id} className="list-group-item">
                                                <strong>Category:</strong> {cat.category?.name}
                                                <br />
                                                <strong>Services:</strong> {cat?.service?.length > 0 && cat?.service?.map((sub, k) =>
                                                    sub?.name + ',') || 'None'}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="marketing" role="tabpanel">
                                <div
                                    className="tab-pane fade show active"
                                    id="marketing"
                                    role="tabpanel"
                                >
                                    <div className="col-sm-12 mb-3">
                                        <label htmlFor='expreience'>Experience</label>
                                        <div className='border p-4 rounded'>
                                            <div dangerouslySetInnerHTML={{ __html: values1.experience }} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 mb-3">
                                        <label htmlFor='expertise'>Expertise</label>
                                        <div className='border p-4 rounded'>
                                            <div dangerouslySetInnerHTML={{ __html: values1.expertise }} />
                                        </div>
                                    </div>
                                    {profileData?.type == 'restaurant' && <div className="col-sm-12 mb-3">
                                        <label htmlFor='expertise'>Restaurant Menu</label>
                                        {values1?.menu && (
                                            <div>
                                                {values1?.menu?.toLowerCase().endsWith('.pdf') ? (
                                                    // If it's a PDF, show a link or embedded viewer
                                                    <iframe
                                                        src={`https://api.wizbizlaonboard.com${values1?.menu}`}
                                                        width="100%"
                                                        height="500px"
                                                        title="Menu"
                                                    />
                                                ) : (
                                                    // Otherwise, assume it's an image
                                                    <img
                                                        src={`https://api.wizbizlaonboard.com${values1?.menu}`}
                                                        height={100}
                                                        alt="Menu"
                                                        className='img-fluid'
                                                        style={{ maxWidth: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {values1?.menu &&
                                            values?.menu?.toLowerCase()?.endsWith('.pdf') ? '' : <button className="btn btn-primary w-25" onClick={() => downloadImage(values1?.menu?.slice(1))}>
                                            Download
                                        </button>
                                        }
                                    </div>}

                                    <div className="mb-3">
                                        <h6>Additional Sections</h6>
                                        {values1.additionalSections?.map((section, index) => {
                                            if (section.type === 'text') {
                                                return (
                                                    <React.Fragment key={section._id} >
                                                        <p>{index+1}.Text Category</p>
                                                        <div className="border p-3 mb-3 rounded">
                                                            <h6>{section.title}</h6>
                                                            <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                                        </div>
                                                    </React.Fragment>
                                                )
                                            } else if (section.type === 'gallery') {
                                                return (
                                                    <React.Fragment key={section._id} >
                                                        <p>{index+1}. Gallery</p>
                                                        <div className="border p-3 mb-3 rounded">
                                                            <h6>{section.title}</h6>
                                                            <div className="d-flex flex-wrap">
                                                                {section.galleryImages?.map((img, imgIndex) => (
                                                                    <div key={imgIndex} className="me-2 mb-2">
                                                                        {renderImage(img)}
                                                                        {img &&
                                                                            <button className="btn btn-primary w-auto" onClick={() => downloadImage(img?.slice(1))}>
                                                                                Download
                                                                            </button>}

                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                )
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <div className="mb-3">
                                        <h6> Thought Leadership Portfolio</h6>
                                        {values1.thoughtLeadershipPortfolio?.map((item, index) => {
                                            return (
                                                <div key={item._id} className="border p-3 mb-3 rounded">
                                                    <div className="mb-2">
                                                        <label htmlFor='port'>Portfolio Image</label>
                                                        <div>{renderBannerImage(item.imageUrl)}</div>
                                                        {item?.imageUrl &&
                                                            <button className="btn btn-primary w-auto" onClick={() => downloadImage(item?.imageUrl)}>
                                                                Download
                                                            </button>}

                                                    </div>
                                                    <div className="mb-2">
                                                        <label htmlFor='taglabel'>Tag Label:</label>
                                                        <input type="text" className="form-control" value={item.tagLabel} disabled />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label htmlFor='link'>Content Link:</label>
                                                        <input type="text" className="form-control" value={item.contentLink} disabled />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>


                                    <div className="mb-3">
                                        <label htmlFor='video'>Promotional Video</label>
                                        <div>{renderVideo(values1.videoIntro)}</div>
                                        {/* {values1?.videoIntro &&<button className="btn btn-primary w-25" onClick={() => downloadVideo(values1?.videoIntro)}>
                                        Download
                                    </button>} */}

                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="trade" role="tabpanel">
                                <div
                                    className="tab-pane fade show active"
                                    id="trade"
                                    role="tabpanel"
                                >
                                    <div className="col-sm-12 my-2">
                                        <label htmlFor='used'>License Used By</label>
                                        <input type="text" className="form-control" value={values2.licenseUsedBy} disabled />
                                    </div>

                                    <div className="col-sm-12 my-2">
                                        <label htmlFor='certificate text-capitalize'>Trade License Currently Active</label>
                                        <input type="text" className="form-control" value={values2.licenseCurrentlyActive ? "Yes" : "No"} disabled />
                                    </div>

                                    <div className="mb-3">
                                        <h6>Licenses</h6>
                                        {values2.licenses?.map((license, index) => (
                                            <div key={license._id} className="border p-3 mb-3 rounded">
                                                <div className="row">
                                                    <div className="col-sm-12 mt-2">
                                                        <label htmlFor='licencefile'>Trade License File</label>
                                                        {license.tradeLicenseFile && (
                                                            <div>
                                                                {license.tradeLicenseFile.toLowerCase().endsWith('.pdf') ? (
                                                                    // If it's a PDF, show a link or embedded viewer
                                                                    <iframe
                                                                        src={`https://api.wizbizlaonboard.com${license.tradeLicenseFile}`}
                                                                        width="100%"
                                                                        height="500px"
                                                                        title="License PDF"
                                                                    />
                                                                ) : (
                                                                    // Otherwise, assume it's an image
                                                                    <img
                                                                        src={`https://api.wizbizlaonboard.com${license.tradeLicenseFile}`}
                                                                        height={50}
                                                                        alt="License"
                                                                        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}

                                                        {license?.tradeLicenseFile &&
                                                            !license.tradeLicenseFile.toLowerCase().endsWith('.pdf') ? <button className="btn btn-primary w-25" onClick={() => downloadImage(license.tradeLicenseFile?.slice(1))}>
                                                            Download
                                                        </button> : ' no data'
                                                        }

                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='trade'>Trade License Number</label>
                                                        <input type="text" className="form-control" value={license.tradeLicenseNumber} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='issuedate'>License Issue Date</label>
                                                        <input type="text" className="form-control"
                                                            value={license.licenseIssueDate ? new Date(license.licenseIssueDate).toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    }) : ''}
                                                            disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='expiry'>License Expiry Date</label>
                                                        <input type="text" className="form-control"
                                                            value={license.licenseExpiryDate ? new Date(license.licenseExpiryDate).toLocaleDateString('en-GB', {                                                                                       day: '2-digit',                                                                                        month: '2-digit',                                                                                        year: 'numeric'                                                                                    }) : ''}
                                                            disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='body'>Under what name is your trade license issued?</label>
                                                        <input type="text" className="form-control" value={license.licenseIssuingBody} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='licencein'>Which Emirate is your trade license issued from?</label>
                                                        <input type="text" className="form-control" value={license.licenseIssuedIn} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='pro'>Year of Company Formation</label>
                                                        <input type="text" className="form-control" value={license.licenseProfessionalBody} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='Companytype'>Where your license is issued ?</label>
                                                        <input type="text" className="form-control" value={license.companyFormationType} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='category'>Name of the {license.companyFormationType}</label>
                                                        <input type="text" className="form-control" value={license.licenseProfessionalCategory} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='serve' className='service'>The Activities you are licensed o conduct under
                                                            this license</label>
                                                        <input type="text" className="form-control" value={license.licenseServicesUnder} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='operation'>International Operation</label>
                                                        <input type="text" className="form-control"
                                                            value={license.licenseInternationalOperation ? "Yes" : "No"}
                                                            disabled />
                                                    </div>


                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor='operation'>Does your trade or industry require regulation by law?</label>
                                        <input type="text" className="form-control"
                                        value={values2?.isRegulatedByLaw ? "Yes" : "No"}
                                        disabled />
                                    </div>

                                    <div className="mb-3">
                                        <h6>Which professional service you are regulated by.</h6>
                                        <ul className="list-group">
                                            {values2.professionalServices?.map((service, index) => (
                                                <li key={service._id} className="list-group-item">
                                                    <strong>Profession:</strong> {service.regulatedProfession}
                                                    <br />
                                                    <strong>Active:</strong> {service.isActive ? "Yes" : "No"}
                                                    <br />
                                                    <strong>Display on Profile:</strong> {service.displayOnProfile ? "Yes" : "No"}
                                                </li>
                                            ))}
                                            {(!values2.professionalServices || values2.professionalServices.length === 0) &&
                                                <li className="list-group-item">No professional services</li>
                                            }
                                        </ul>
                                    </div>
                                    <div className="mb-3">
                                        <h6>Additional Certificates</h6>
                                        <ul className="list-group">
                                            {values2.additionalCertificates?.map((cert, index) => (
                                                <li key={cert._id} className="list-group-item">{cert.title}</li>
                                            ))}
                                            {(!values2.additionalCertificates || values2.additionalCertificates.length === 0) &&
                                                <li className="list-group-item">No certificates</li>
                                            }
                                        </ul>
                                    </div>

                                </div>
                            </div>
                            <div className="tab-pane fade" id="references" role="tabpanel">
                                <div
                                    className="tab-pane fade show active"
                                    id="references"
                                    role="tabpanel"
                                >
                                    <div className="row mb-3">
                                        <div className="col-sm-6">
                                            <label htmlFor='refrence'>Reference Program</label>
                                            <input type="text" className="form-control" value={values3.referenceProgram ? "Enabled" : "Disabled"} disabled />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <h6>Reference List</h6>
                                        {values3.references?.map((ref, index) => (
                                            <div key={ref._id} className="border p-3 mb-3 rounded">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <label htmlFor='name'>Name of Reference</label>
                                                        <input type="text" className="form-control" value={ref.name} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='relationship'>Relationship</label>
                                                        <input type="text" className="form-control" value={ref.relationship} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='work'>Where did you work together? </label>
                                                        <input type="text" className="form-control" value={ref.workTogether} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='contact'>Best Contact Details</label>
                                                        <input type="text" className="form-control" value={ref.contact} disabled />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!values3.references || values3.references.length === 0) &&
                                            <div className="alert alert-info">No references available</div>
                                        }

                                        <div className="row">
                                            <div className="col-sm-6">
                                                <label htmlFor='name'>Chat</label>
                                                <input type="text" className="form-control" value={values3?.chatShow ? 'Yes' : 'No'} disabled />
                                            </div>
                                            <div className="col-sm-6">
                                                <label htmlFor='name'>Wizbizla Connection</label>
                                                {values3?.connection?.map((item, key) =>
                                                    <div className='mt-2 d-flex gap-2'>
                                                        <input key={key} type="text" className="form-control" value={item?.userId?.firstName + " " + item?.userId?.lastName} disabled />
                                                        {/* <Link to={`/user/detail/${item._id}`} className='btn btn-info'><FaEye/></Link> */}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-sm-6">
                                                    <label htmlFor='recommendations'>Recommendations</label>
                                                    <input type="text" className="form-control" value={values3.recommendations ? "Enabled" : "Disabled"} disabled />
                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >

            <div className="col-2 pb-5">
                <button onClick={() => navigate(-1)} className='btn btn-secondary'>Back</button>
            </div>
        </div >
    )
}

export default UserDetail;