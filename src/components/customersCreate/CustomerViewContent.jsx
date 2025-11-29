import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import base_url from '../../baseUrl';
import { getSecureApiData } from '../../Services/api';

const CustomerViewContent = () => {
    const { id } = useParams();
    const [userData,setUserData]=useState()
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
        references: [],
        referenceProgram: false,
        recommendations: false
    })

    const fetchUserProfileData = async () => {
        try {
            const res = await axios.get(`https://api.wizbizlaonboard.com/api/profile/admin-profile-get/${id}`);
            if (res.data.success) {
                setValues(res.data.data || {})
            }
        } catch (error) {
            console.log("error fetching profile data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    const renderImage = (path) => {
        if (!path) return null;
        const src = `https://api.wizbizlaonboard.com${path.replace(/\\/g, '/')}`;
        return <img src={src} alt="img" className="img-fluid rounded mb-2" style={{ maxWidth: '200px' }} crossOrigin='anonymous' />;
    };
    const renderBannerImage = (path) => {
        if (!path) return null;
        const src = `https://api.wizbizlaonboard.com/${path.replace(/\\/g, '/')}`;
        return <img src={src} alt="img" className="img-fluid rounded mb-2" style={{ maxWidth: '200px' }} crossOrigin='anonymous' />;
    };

    const renderVideo = (path) => {
        if (!path) return null;
        const src = `https://api.wizbizlaonboard.com${path.replace(/\\/g, '/')}`;
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
            const res = await axios.get(`https://api.wizbizlaonboard.com/api/marketing/admin/get-marketing/${id}`);
            if (res.data.success) {
                setValues1(res.data.data || {})
            }
        } catch (error) {
            console.log("error fetching marketing data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    const fetchUsersLicenceData = async () => {
        try {
            const res = await axios.get(`https://api.wizbizlaonboard.com/api/businessLicense/admin-licence-get/${id}`);
            if (res.data.success) {
                setValues2(res.data.data || {})
            }
        } catch (error) {
            console.log("error fetching license data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    const fetchUsersReferenceData = async () => {
        try {
            const res = await axios.get(`https://api.wizbizlaonboard.com/api/features/get/${id}`);
            if (res.data.success) {
                setValues3(res.data.data || {})
            }
        } catch (error) {
            console.log("error fetching references data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };



    useEffect(() => {
        fetchUsersMarketingData();
        fetchUsersData();
        fetchUserProfileData()
        fetchUsersLicenceData();
        fetchUsersReferenceData();
    }, [id])
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
    const fetchUsersData = async () => {
        try {
            const result = await getSecureApiData(`api/users/${id}`)
            if (result.success) {
                setUserData(result.user || {})
            }
        } catch (error) {
            console.log("error fetching profile data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };


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
                                        <input id='name' type="text" className="form-control text-capitalize" value={userData?.firstName} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Last Name</label>
                                        <input id='name' type="text" className="form-control text-capitalize" value={userData?.lastName} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Email</label>
                                        <input id='name' type="text" className="form-control" value={userData?.email} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Contact Number</label>
                                        <input id='name' type="text" className="form-control" value={userData?.contactNumber} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Account Create on </label>
                                        <input id='name' type="text" className="form-control" value={new Date(userData?.createdAt)?.toLocaleDateString()} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Role</label>
                                        <input id='name' type="text" className="form-control" value={userData?.role} disabled />
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="profile"
                                role="tabpanel"
                            >
                                <div className="row mb-3">
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Type</label>
                                        <input id='name' type="text" className="form-control text-capitalize" value={values?.type} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Name</label>
                                        <input id='name' type="text" className="form-control" value={values.name} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='title'>Title</label>
                                        <input id='title' type="text" className="form-control" value={values.title} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='company'>Company / Organization</label>
                                        <input type="text" className="form-control" value={values.company} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='location'>Head Office Location</label>
                                        <input type="text" className="form-control" value={values.location} disabled />
                                    </div>
                                    <div className="col-sm-12">
                                        <label htmlFor='avatar'>Avatar</label>
                                        <textarea className="form-control" value={values.avatar} disabled />
                                    </div>
                                    <div className="col-sm-12">
                                        <label htmlFor='clientprofile'>Ideal Client Profile</label>
                                        <textarea className="form-control" value={values.idealClientProfile} disabled />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor='banner'>Banner Image</label>
                                    <div>{renderBannerImage(values.bannerImage)}</div>
                                    {/* <a
                            className="btn btn-primary w-25"
                            target='_blank'
                            href={`${base_url}/${values.bannerImage}`}
                            download
                        >
                            Download
                        </a> */}
                                    {values?.bannerImage && <button className="btn btn-primary w-25" onClick={() => downloadImage(values.bannerImage)}>
                                        Download
                                    </button>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor='profileimage'>Profile Image</label>
                                    <div>{renderBannerImage(values.profileImage)}</div>
                                    {values?.profileImage && <button className="btn btn-primary w-25" onClick={() => downloadImage(values.profileImage)}>
                                        Download
                                    </button>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor='categories'>Categories & Services</label>
                                    <ul className="list-group">
                                        {values.categories?.map((cat, index) => (
                                            <li key={cat._id} className="list-group-item">
                                                <strong>Category:</strong> {cat.category?.name}
                                                <br />
                                                <strong>Services:</strong> {cat?.service?.length>0 && cat?.service?.map((sub,k)=>
                                                 sub?.name+',') || 'None'}
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

                                   <div className="mb-3">
                                        <h6>Additional Sections</h6>
                                        {values1.additionalSections?.map((section, index) => {
                                            if (section.type === 'text') {
                                                return (
                                                    <React.Fragment key={section._id} >
                                                        <p>1.Text Category</p>
                                                        <div className="border p-3 mb-3 rounded">
                                                            <h6>{section.title}</h6>
                                                            <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                                        </div>
                                                    </React.Fragment>
                                                )
                                            } else if (section.type === 'gallery') {
                                                return (
                                                    <React.Fragment key={section._id} >
                                                        <p>2. Gallery</p>
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
                                        <h6>Thought Leadership Portfolio</h6>
                                        {values1.thoughtLeadershipPortfolio?.map((item, index) => {
                                            return (
                                                <div key={item._id} className="border p-3 mb-3 rounded">
                                                    <div className="mb-2">
                                                        <label htmlFor='port'>Portfolio Image</label>
                                                        <div>{renderBannerImage(item.imageUrl)}</div>

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
                                        <label htmlFor='video'>Video Introduction</label>
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
                                        <label htmlFor='certificate'>License Currently Active</label>
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
                                                                        className='img-fluid'
                                                                        style={{ maxWidth:'200px',border: '1px solid #ccc', borderRadius: '4px' }}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}

                                                        {license?.tradeLicenseFile &&
                                                            license.tradeLicenseFile.toLowerCase().endsWith('.pdf') ? '' : <button className="btn btn-primary w-25" onClick={() => downloadImage(license.tradeLicenseFile?.slice(1))}>
                                                            Download
                                                        </button>
                                                        }

                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='trade'>Trade License Number</label>
                                                        <input type="text" className="form-control" value={license.tradeLicenseNumber} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='issuedate'>License Issue Date</label>
                                                        <input type="text" className="form-control"
                                                            value={license.licenseIssueDate ? new Date(license.licenseIssueDate).toLocaleDateString() : ''}
                                                            disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='expiry'>License Expiry Date</label>
                                                        <input type="text" className="form-control"
                                                            value={license.licenseExpiryDate ? new Date(license.licenseExpiryDate).toLocaleDateString() : ''}
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
                                                        <label htmlFor='Companytype'>Year of Company Formation</label>
                                                        <input type="text" className="form-control" value={license.licenseProfessionalBody} disabled />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor='pro'>Where your license is issued</label>
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
                                            {values2?.additionalCertificates?.map((cert, index) => (
                                                <li key={cert?._id} className="list-group-item">{cert?.title}</li>
                                            ))}
                                            {(!values2?.additionalCertificates || values2?.additionalCertificates?.length === 0) &&
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
                                                        <label htmlFor='work'>Where did you work together?</label>
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
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">User Profile Details</h5>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-sm-6">
                            <label htmlFor='name'>Name</label>
                            <input id='name' type="text" className="form-control" value={values.name} disabled />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='title'>Title</label>
                            <input id='title' type="text" className="form-control" value={values.title} disabled />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='company'>Company</label>
                            <input type="text" className="form-control" value={values.company} disabled />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor='location'>Location</label>
                            <input type="text" className="form-control" value={values.location} disabled />
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor='avatar'>Avatar</label>
                            <textarea className="form-control" value={values.avatar} disabled />
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor='clientprofile'>Ideal Client Profile</label>
                            <textarea className="form-control" value={values.idealClientProfile} disabled />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor='banner'>Banner Image</label>
                        <div>{renderBannerImage(values.bannerImage)}</div>
                       
                        {values?.bannerImage && <button className="btn btn-primary w-25" onClick={() => downloadImage(values.bannerImage)}>
                            Download
                        </button>}


                    </div>

                    <div className="mb-3">
                        <label htmlFor='profileimage'>Profile Image</label>
                        <div>{renderBannerImage(values.profileImage)}</div>
                        {values?.profileImage && <button className="btn btn-primary w-25" onClick={() => downloadImage(values.profileImage)}>
                            Download
                        </button>}

                    </div>

                    <div className="mb-3">
                        <label htmlFor='categories'>Categories</label>
                        <ul className="list-group">
                            {values.categories?.map((cat, index) => (
                                <li key={cat._id} className="list-group-item">
                                    <strong>Category:</strong> {cat.category}
                                    <br />
                                    <strong>Services:</strong> {cat.service?.join(', ') || 'None'}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <hr />
                    <h4>Profile Marketing</h4>

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

                    <div className="mb-3">
                        <label htmlFor='video'>Video Intro</label>
                        <div>{renderVideo(values1.videoIntro)}</div>
                       

                    </div>

                    <div className="mb-3">
                        <h6>Portfolio</h6>
                        {values1.thoughtLeadershipPortfolio?.map((item, index) => {
                            return (
                                <div key={item._id} className="border p-3 mb-3 rounded">
                                    <div className="mb-2">
                                        <label htmlFor='port'>Portfolio Image</label>
                                        <div>{renderBannerImage(item.imageUrl)}</div>

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
                        <h6>Additional Sections</h6>
                        {values1.additionalSections?.map((section, index) => {
                            if (section.type === 'text') {
                                return (
                                    <React.Fragment key={section._id} >
                                        <p>1.Text Category</p>
                                        <div className="border p-3 mb-3 rounded">
                                            <h6>{section.title}</h6>
                                            <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                        </div>
                                    </React.Fragment>
                                )
                            } else if (section.type === 'gallery') {
                                return (
                                    <React.Fragment key={section._id} >
                                        <p>2. Gallery</p>
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

                    <hr />
                    <h4>Registration and Certificates Details</h4>

                    <div className="col-sm-12 my-2">
                        <label htmlFor='used'>License Used By</label>
                        <input type="text" className="form-control" value={values2.licenseUsedBy} disabled />
                    </div>

                    <div className="col-sm-12 my-2">
                        <label htmlFor='certificate'>Has Certificate</label>
                        <input type="text" className="form-control" value={values2.hasCertificate ? "Yes" : "No"} disabled />
                    </div>

                    <div className="mb-3">
                        <h6>Licenses</h6>
                        {values2.licenses?.map((license, index) => (
                            <div key={license._id} className="border p-3 mb-3 rounded">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <label htmlFor='trade'>Trade License Number</label>
                                        <input type="text" className="form-control" value={license.tradeLicenseNumber} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='issuedate'>License Issue Date</label>
                                        <input type="text" className="form-control"
                                            value={license.licenseIssueDate ? new Date(license.licenseIssueDate).toLocaleDateString() : ''}
                                            disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='expiry'>License Expiry Date</label>
                                        <input type="text" className="form-control"
                                            value={license.licenseExpiryDate ? new Date(license.licenseExpiryDate).toLocaleDateString() : ''}
                                            disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='body'>License Issuing Body</label>
                                        <input type="text" className="form-control" value={license.licenseIssuingBody} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='licencein'>License Issued In</label>
                                        <input type="text" className="form-control" value={license.licenseIssuedIn} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='pro'>License Professional Body</label>
                                        <input type="text" className="form-control" value={license.licenseProfessionalBody} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='category'>License Professional Category</label>
                                        <input type="text" className="form-control" value={license.licenseProfessionalCategory} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='serve' className='service'>License Services Under</label>
                                        <input type="text" className="form-control" value={license.licenseServicesUnder} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='operation'>License International Operation</label>
                                        <input type="text" className="form-control"
                                            value={license.licenseInternationalOperation ? "Yes" : "No"}
                                            disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='Companytype'>Company Formation Type</label>
                                        <input type="text" className="form-control" value={license.companyFormationType} disabled />
                                    </div>
                                    <div className="col-sm-12 mt-2">
                                        <label htmlFor='licencefile'>Trade License File</label>
                                        {license.tradeLicenseFile && (
                                            <div>
                                                {license.tradeLicenseFile.toLowerCase().endsWith('.pdf') ? (
                                                    <iframe
                                                        src={`https://api.wizbizlaonboard.com${license.tradeLicenseFile}`}
                                                        width="100%"
                                                        height="500px"
                                                        title="License PDF"
                                                    />
                                                ) : (
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
                                            license.tradeLicenseFile.toLowerCase().endsWith('.pdf') ? '' : <button className="btn btn-primary w-25" onClick={() => downloadImage(license.tradeLicenseFile?.slice(1))}>
                                            Download
                                        </button>
                                        }

                                    </div>
                                </div>
                            </div>
                        ))}
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

                    <div className="mb-3">
                        <h6>Professional Services</h6>
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

                    <hr />
                    <h4>References</h4>

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
                                        <label htmlFor='name'>Name</label>
                                        <input type="text" className="form-control" value={ref.name} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='relationship'>Relationship</label>
                                        <input type="text" className="form-control" value={ref.relationship} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='work'>Work Together</label>
                                        <input type="text" className="form-control" value={ref.workTogether} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='contact'>Contact</label>
                                        <input type="text" className="form-control" value={ref.contact} disabled />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!values3.references || values3.references.length === 0) &&
                            <div className="alert alert-info">No references available</div>
                        }
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default CustomerViewContent;