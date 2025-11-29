import React, { useEffect } from 'react'
import PaymentRecordChart from '@/components/widgetsCharts/PaymentRecordChart'
import SiteOverviewStatistics from '@/components/widgetsStatistics/SiteOverviewStatistics'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [])
    return (
        <>
            <PageHeader >
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <SiteOverviewStatistics />
                    <PaymentRecordChart />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home