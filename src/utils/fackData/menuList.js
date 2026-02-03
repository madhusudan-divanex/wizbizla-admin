export const menuList = [
 
    {
        id: 1,
        name: "Onboarding Form ",
        path: "/",
        // icon: 'fa-form',
        // dropdownMenu: [
        //     {
        //         id: 1,
        //         name: "List",
        //         path: "/",
        //         subdropdownMenu: false
        //     },
        //     // {
        //     //     id: 2,
        //     //     name: "User Create",
        //     //     path: "/user/create",
        //     //     subdropdownMenu: false
        //     // }
        // ]
    },

    {
        id: 3,
        name: "Service Provider",
        path: "#",
        // icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "Pending Accreditation",
                path: "/user/provider?data=pending",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "All Providers",
                path: "/user/provider?data=provider",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Pending Trade License Accreditation",
                path: "/user/provider?data=license",
                subdropdownMenu: false
            },

        ]
    },
     {
        id: 8,
        name: "Reference Request",
        path: "#",
        // icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "Provider",
                path: "/get-add-references",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Consumer",
                path: "/consumer-references",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Signature Profile References",
                path: "/references",
                subdropdownMenu: false
            },
        ]
    },
     {
        id: 2,
        name: "Service Request ",
        path: "#",
        // icon: 'fa-pray',
        dropdownMenu: [
            {
                id: 1,
                name: "Bespoke Concierge Service",
                path: "/bespoke-concierge",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Customized Due Diligence Service",
                path: "/customized-service",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Service Dispute",
                path: "/service-dispute",
                subdropdownMenu: false
            },


        ]
    },
    {
        id: 10,
        name: "Chat",
        path: "/chat",
        // icon: 'fa-chat',
      
    },
     {
        id: 8,
        name: "Welcome Basket",
        path: "/welcome-basket",
        // icon: 'fa-basket',
        
    },
    {
        id: 7,
        name: "Advertisement",
        path: "#",
        // icon: 'fa-ad',
        dropdownMenu: [
            // {
            //     id: 1,
            //     name: "References",
            //     path: "/references",
            //     subdropdownMenu: false
            // },
            {
                id: 2,
                name: "Requests",
                path: "/advertisement?list=true",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Approve",
                path: "/approved-advertisement?list=true",
                subdropdownMenu: false
            },
        ]
    },
   {
        id: 6,
        name: "Scam Posting Story",
        path: "#",
        // icon: 'fa-scam',
        dropdownMenu: [
            {
                id: 1,
                name: "All Scam Submissions",
                path: "/scam-report",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Scam  Type",
                path: "/scam-type",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Service Category",
                path: "/service-category",
                subdropdownMenu: false
            },

        ]
    },
    {
        id: 9,
        name: "Blog",
        path: "#",
        // icon: 'fa-blog',
        dropdownMenu: [
            {
                id: 1,
                name: "Blogs",
                path: "/cms/blog",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Add New Blog",
                path: "/cms/blog?create=true",
                subdropdownMenu: false
            },
        ]
    },
    {
        id:21,
        name:"Reports",
        path:'/transactions'
    },
    {
        id: 10,
        name: "General Pages",
        path: "#",
        // icon: 'fa-general',
        dropdownMenu: [
            {
                id: 1,
                name: "Faq",
                path: "/cms/faq",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Scam Tip/Alert",
                path: "/cms/scam-tip",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Purchase List",
                path: "/membership-purchase",
                subdropdownMenu: false
            },
            {
                id: 4,
                name: "Consumers",
                path: "/user/consumer",
                subdropdownMenu: false
            },
            {
                id: 6,
                name: "Deleted User",
                path: "/user/deleted-user",
                subdropdownMenu: false
            },
            {
                id: 7,
                name: "Blog Category",
                path: "/cms/blog-category",
                subdropdownMenu: false
            },
        ]
    },
    {
        id: 4,
        name: "All Users ",
        path: "#",
        // icon: 'fa-users',
        dropdownMenu: [
            {
                id: 1,
                name: "All Users",
                path: "/user/all",
                subdropdownMenu: false
            },            

        ]
    },
   
   
    {
        id:22,
        name:"Setting",
    },
    {
        id: 8,
        name: "Membership ",
        path: "#",
        // icon: 'fa-m',
        dropdownMenu: [
            {
                id: 1,
                name: "Package",
                path: "/membership",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Add on Service",
                path: "/add-on-services",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 9,
        name: "Category",
        path: "#",
        // icon: 'fa-puzzel',
        dropdownMenu: [
            {
                id: 1,
                name: "Category",
                path: "/category",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Sub Category",
                path: "/sub-category",
                subdropdownMenu: false
            },
        ]
    },
    {
        id: 3,
        name: "Subscribers ",
        path: "#",
        // icon: 'feather-users',
        dropdownMenu: [
            {
                id: 4,
                name: "Blog",
                path: "/newsletter",
                subdropdownMenu: false
            },
            {
                id: 5,
                name: "Podcast ",
                path: "/podcast-subscribers",
                subdropdownMenu: false
            }
        ]
    }, 
    
    {
        id: 7,
        name: "Contact ",
        path: "#",
        // icon: 'fa-contact',
        dropdownMenu: [
            {
                id: 1,
                name: "Contact",
                path: "/contact-query",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Get in Touch",
                path: "/get-in-touch",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Feedback",
                path: "/feedback",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Concern",
                path: "/concern",
                subdropdownMenu: false
            },
            
            
        ]
    },
    
    //shubham code
    {
        id: 10,
        name: "Frontend Management",
        path: "#",
        // icon: 'fa-sliders-h',
        dropdownMenu: [
            {
                id: 1,
                name: "Add Home Banner",
                path: "/cms/home-banner-create",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "All Home Banner",
                path: "/cms/home-banner",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Add Find Resources",
                path: "/cms/find-resources-create",
                subdropdownMenu: false
            },
            {
                id: 4,
                name: "All Find Resources",
                path: "/cms/find-resources",
                subdropdownMenu: false
            },
            {
                id: 5,
                name: "Add Market Glance",
                path: "/cms/market-glance-create",
                subdropdownMenu: false
            },
            {
                id: 6,
                name: "All Market Glance",
                path: "/cms/market-glance",
                subdropdownMenu: false
            },
            {
                id: 7,
                name: "Add Exclusive Memberships",
                path: "/cms/exclusive-memberships-create",
                subdropdownMenu: false
            },
            {
                id: 8,
                name: "All Exclusive Memberships",
                path: "/cms/exclusive-memberships",
                subdropdownMenu: false
            },
            {
                id: 1,
                name: "Home Title",
                path: "/cms/home-title",
                subdropdownMenu: false
            },
        ]
    }

]
