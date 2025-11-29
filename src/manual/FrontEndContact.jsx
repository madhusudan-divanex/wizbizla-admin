import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getApiData, postApiData } from '../Services/api'
import Footer from '@/components/shared/Footer'

function FrontEndContact() {
    const [contactData, setContactData] = useState({
        whatsappLink: "",
        mobileFirst: "",
        mobileSecond: "",
        socialMedia: {
            instagram: "",
            facebook: "",
            twitter: "",
            linkedin: "",
            youtube: ""
        },
        address1: "",
        address2: "",
        email: "",
    })

    async function handleSubmit(e) {
        e.preventDefault()
        const socialMedia = JSON.stringify(contactData.socialMedia)
        const dataToSubmit = { ...contactData, socialMedia }
        try {
            const response = await postApiData('cms/contact', dataToSubmit)
            if (response.success) {
                toast.success("Data updated successfully")
            }
        } catch (error) {

        }
    }
    async function getContact() {
        try {
            const response = await getApiData('cms/contact')
            if (response.success) {
                setContactData(response.data)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getContact()
    }, [])
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in contactData.socialMedia) {
            setContactData(prevData => ({
                ...prevData,
                socialMedia: {
                    ...prevData.socialMedia,
                    [name]: value
                }
            }));
        } else {
            setContactData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    return (
        <>
            <PageHeader />
            <form onSubmit={handleSubmit} className='main-content'>
                <div className="row mb-3">

                    <div className="col-sm-6">
                        <label>Whatsapp Link</label>
                        <input type="text" className="form-control" onChange={handleChange} name="whatsappLink" value={contactData?.whatsappLink} />
                    </div>

                    <div className="col-sm-6">
                        <label>Address 1</label>
                        <input type="text" className="form-control" onChange={handleChange} name="address1" value={contactData?.address1} />
                    </div>
                    <div className="col-sm-6">
                        <label>Address 2</label>
                        <input type="text" className="form-control" onChange={handleChange} name="address2" value={contactData?.address2} />
                    </div>
                    <div className="col-sm-6">
                        <label>Email</label>
                        <input type="text" className="form-control" onChange={handleChange} name="email" value={contactData?.email} />
                    </div>

                    <div className="col-sm-6">
                        <label>Contact Number 1</label>
                        <input type="number" className="form-control" onChange={handleChange} name="mobileFirst" value={contactData?.mobileFirst} />
                    </div>
                    <div className="col-sm-6">
                        <label>Contact Number 2</label>
                        <input type="number" className="form-control" onChange={handleChange} name="mobileSecond" value={contactData?.mobileSecond} />
                    </div>
                    <h5>Social Media</h5>
                    <div className="col-sm-6">
                        <label>Instagram</label>
                        <input type="text" className="form-control" onChange={handleChange} name="instagram" value={contactData?.socialMedia?.instagram} />
                    </div>

                    <div className="col-sm-6">
                        <label>Facebook</label>
                        <input type="text" className="form-control" onChange={handleChange} name="facebook" value={contactData?.socialMedia?.facebook} />
                    </div>

                    <div className="col-sm-6">
                        <label>Youtube</label>
                        <input type="text" className="form-control" onChange={handleChange} name="youtube" value={contactData?.socialMedia?.youtube} />
                    </div>

                    <div className="col-sm-6">
                        <label>Twitter</label>
                        <input type="text" className="form-control" onChange={handleChange} name="twitter" value={contactData?.socialMedia?.twitter} />
                    </div>
                    <div className="col-sm-6">
                        <label>Linkedin</label>
                        <input type="text" className="form-control" onChange={handleChange} name="linkedin" value={contactData?.socialMedia?.linkedin} />
                    </div>

                    <div className="col-sm-6">
                        <label>Last Update</label>
                        <input
                            type="text"
                            className="form-control"
                            value={contactData?.updatedAt && new Date(contactData?.updatedAt).toLocaleDateString()}
                            disabled
                        />
                    </div>
                </div>

                <div className="col-2 pb-5">
                    <button type='submit' className='btn btn-primary'>Update</button>
                </div>
            </form>
            <Footer/>
        </>
    )
}

export default FrontEndContact
