import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSecureApiData, postApiData } from '../Services/api';
import base_url from '../baseUrl';
import { FaEye } from 'react-icons/fa6';

const ConsumerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const [bannerPath, setBannerPath] = useState()
    const [membershipData, setMembershipData] = useState()
    const [status, setStatus] = useState('pending')
    const [values, setValues] = useState({})
    const [profileData, setProfileData] = useState({})
    const [values1, setValues1] = useState({})
    const [values2, setValues2] = useState({})
    const [values3, setValues3] = useState({})
    const [values4, setValues4] = useState({})

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


    useEffect(() => {
        fetchUsersServiceData()
        fetchUsersData();
        fetchUsersProfileData()
        fetchUsersBasketData()
        fetchUsersReferenceData()
        fetchUsersStayData()

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

    const fetchUsersBasketData = async () => {
        try {
            const res = await getSecureApiData(`api/consumer/basket/${id}`);
            if (res.status) {
                setValues1(res.data || {})
            }
        } catch (error) {
            console.log("error fetching basket data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };
    const fetchUsersStayData = async () => {
        try {
            const res = await getSecureApiData(`api/consumer/stayUpdate/${id}`);
            if (res.status) {
                setValues5(res.data || {})
            }
        } catch (error) {
            console.log("error fetching basket data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    const fetchUsersServiceData = async () => {
        try {
            const res = await getSecureApiData(`api/consumer/service/${id}`);
            if (res.status) {
                setValues2(res.data || {})
            } else {
                setValues2({})
            }
        } catch (error) {
            console.log("error fetching service data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };

    const fetchUsersReferenceData = async () => {
        try {
            const res = await getSecureApiData(`api/consumer/preference/${id}`);
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
            const res = await getSecureApiData(`api/consumer/profile/${id}`);
            if (res.status) {
                setProfileData(res.data || {})
            }
        } catch (error) {
            console.log("error fetching references data", error);
            // toast.error(error.response?.data?.message || "Server error");
        }
    };
    const userActionProfile = async () => {
        const data = { userId: id, status, isAdmin: true }
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
                                href="#basket"
                                role="tab"
                            >
                                Welcome Basket
                            </a>
                        </li>

                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link"
                                id="profile-tab"
                                data-bs-toggle="tab"
                                href="#services"
                                role="tab"
                            >
                                Services and Resources
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
                                Personal Preferences
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link "
                                id="home-tab"
                                data-bs-toggle="tab"
                                href="#stay"
                                role="tab"
                            >
                                Stay Updated
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
                                        <input id='name' type="text" className="form-control" value={new Date(values?.createdAt)?.toLocaleDateString()} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Role</label>
                                        <input id='name' type="text" className="form-control" value={values?.role} disabled />
                                    </div>
                                    {values2?.termsAgreed && <div className="col-sm-6">
                                        <label htmlFor='name'>Status</label>
                                        <select id='name' name='status' type="text" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approve</option>
                                            <option value="block">Block</option>

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
                                            <input id='title' type="text" className="form-control" value={new Date(membershipData?.startDate)?.toLocaleDateString()} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='email'>End Date</label>
                                            <input type="text" className="form-control" value={new Date(membershipData?.endDate)?.toLocaleDateString()} disabled />
                                        </div>

                                    </div> : 'No Data available'}
                                </div>
                            </div>
                            <div
                                className="tab-pane fade show "
                                id="stay"
                                role="tabpanel"
                            >
                                <div className="row mb-3">
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Updates on my selected services</label>
                                        <input id='name' type="text" className="form-control" value={values4?.selectedService ? 'Yes' : 'No'} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Promotions and discounts</label>
                                        <input id='name' type="text" className="form-control" value={values4?.promotions ? 'Yes' : 'No'} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Special Offers </label>
                                        <input id='name' type="text" className="form-control" value={values4?.offers ? 'Yes' : 'No'} disabled />
                                    </div>
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
                                        <input id='name' type="text" className="form-control text-capitalize" value={profileData?.company == "" ? 'individual' : 'company'} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>First Name</label>
                                        <input id='name' type="text" className="form-control" value={profileData?.firstName} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='name'>Last Name</label>
                                        <input id='name' type="text" className="form-control" value={profileData?.lastName} disabled />
                                    </div>
                                    {profileData?.company !== "" && <div className="col-sm-6">
                                        <label htmlFor='company'>Company / Organization</label>
                                        <input type="text" className="form-control" value={profileData?.company} disabled />
                                    </div>}
                                    <div className="col-sm-6">
                                        <label htmlFor='email'>Email</label>
                                        <input type="text" className="form-control" value={profileData?.email} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='gender'>Gender</label>
                                        <input type="text" className="form-control" value={profileData?.gender} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='dob'>D.O.B.</label>
                                        <input type="text" className="form-control" value={new Date(profileData?.dob).toLocaleDateString()} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='nationality'>Nationlaity</label>
                                        <input type="text" className="form-control" value={profileData?.nationality} disabled />
                                    </div>
                                    <div className="col-sm-6 d-flex flex-column">
                                        <label htmlFor='nationality'>Image</label>
                                        <img src={`${base_url}/${profileData?.profileImage}`} className="w-25" />
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="basket" role="tabpanel">
                                <div
                                    className="tab-pane fade show active"
                                    id="basket"
                                    role="tabpanel"
                                >
                                    <div className="row mb-3">
                                        <div className="col-sm-6">
                                            <label htmlFor='nationality'>I would like to receive a gift box of sample products and services from local businesses</label>
                                            <input type="text" className="form-control" value={values1?.receiveGiftBox ? 'Yes' : 'No'} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='area'>Area</label>
                                            <input type="text" className="form-control" value={values1?.area} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='emirate'>Emirate</label>
                                            <input type="text" className="form-control" value={values1?.emirate} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='address'>Address</label>
                                            <input type="text" className="form-control" value={values1?.address} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='nationality'>Contact Number</label>
                                            <input type="text" className="form-control" value={values1?.phone} disabled />
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor='nationality'>Your Expat Status in the UAE</label>
                                            <input type="text" className="form-control" value={values1?.expatStatus} disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade show "
                                id="services"
                                role="tabpanel"
                            >
                                <div className="col-sm-12 my-2">
                                    <label htmlFor='used'>The top 10 services you would use this website for?</label>
                                    {values2?.intrestedServices?.map((item, key) =>
                                        <input type="text" key={key} className="form-control" value={item} disabled />)}
                                </div>
                                <div className="col-sm-12 my-2">
                                    <label htmlFor='used'>The top 10 services you would use this website for?</label>
                                    {values2?.usedServices?.split(',')?.map((item, key) =>
                                        <input type="text" key={key} className="form-control" value={item} disabled />)}
                                </div>
                            </div>
                            <div
                                className="tab-pane fade show "
                                id="references"
                                role="tabpanel"
                            >
                                <div className="row mb-3">
                                    <div className="col-sm-6">
                                        <label htmlFor='passionateTopics'>What topics are you most passionate about in the UAE?</label>
                                        <input type="text" className="form-control" value={values3.passionateTopics} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='podcastSubjects'>Which podcast subjects do you enjoy listening to the most?</label>
                                        <input type="text" className="form-control" value={values3.podcastSubjects} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='hobbies'>What hobbies do you pursue in your free time?</label>
                                        <input type="text" className="form-control" value={values3.hobbies} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='favoriteActivities'>What are your favorite activities as an expat?</label>
                                        <input type="text" className="form-control" value={values3.favoriteActivities} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='infoPreference'>How do you prefer to receive information ?</label>
                                        <input type="text" className="form-control" value={values3.infoPreference} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='desiredFeatures'>What features would you like to see on the Wizbizla platform?</label>
                                        <input type="text" className="form-control" value={values3.desiredFeatures} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='expatChallenges'>What challenges do you face as an expat in the UAE?</label>
                                        <input type="text" className="form-control" value={values3.expatChallenges} disabled />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor='improvementSuggestions'>How can we improve your experience as a member?</label>
                                        <input type="text" className="form-control" value={values3.improvementSuggestions} disabled />
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

export default ConsumerDetail;