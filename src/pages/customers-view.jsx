import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import CustomersViewHeader from '@/components/customersView/CustomersViewHeader'
import CustomerViewContent from '@/components/customersCreate/CustomerViewContent'

const CustomersView = () => {
    return (
        <>
            <PageHeader>
                {/* <customer /> */}
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <CustomerViewContent/>
                </div>
            </div>
        </>
    )
}

export default CustomersView